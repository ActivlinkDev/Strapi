'use strict';

/**
 * Seed script: creates the category-offer entries (offer-page headline, intro
 * and damage examples per taxonomy category, group or sector) from
 * content/category-offers.json, in every locale Strapi has configured.
 *
 * Taxonomy_Name must be spelled exactly as in the Mongo Category collection —
 * it is the key the backend's /category_offer lookup matches on. Group and
 * sector entries catch any category without its own entry.
 *
 * Entries are left as DRAFTS: damage examples describe what the cover pays
 * for, so each locale must be checked against the product IPIDs before it is
 * published. Pass --publish once that review is done.
 *
 * It is additive and safe to re-run: generic entries (no Client) are matched
 * on Taxonomy_Name + Level, and a locale that already has a Headline is left
 * untouched unless --force is passed. Client-specific overrides are never
 * created or modified here.
 *
 * Regional locales (fr-BE, nl-BE, …) reuse their base language; locales with
 * no translation fall back to English and are reported as such. To give a
 * region its own wording, add e.g. a "fr-BE" key to `copy` in the JSON: the
 * exact locale is tried before the base language.
 *
 * Usage:
 *   node seed-category-offers.js <adminEmail> <adminPassword> [--force] [--publish]
 *   node seed-category-offers.js --check     (offline: report locales on English fallback)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const UID = 'api::category-offer.category-offer';
const CM_BASE = `/content-manager/collection-types/${UID}`;

// The locales the storefront supports (frontend CLAUDE.md). --check reports
// these even when Strapi is not reachable.
const SUPPORTED_LOCALES = ['en-GB', 'es-ES', 'it-IT', 'fr-FR', 'de-DE', 'fr-BE', 'nl-BE'];

const CONTENT = JSON.parse(fs.readFileSync(path.join(__dirname, 'content/category-offers.json'), 'utf8'));

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const PUBLISH = args.includes('--publish');
const CHECK = args.includes('--check');
const positional = args.filter((a) => !a.startsWith('--'));
const EMAIL = positional[0];
const PASSWORD = positional[1];

function request(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + urlPath);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/** The copy for a locale: exact code, then base language, then English. */
function copyForLocale(code) {
  const exact = CONTENT.copy[code];
  if (exact) return { copy: exact, translated: true };
  const base = String(code || '').toLowerCase().split('-')[0];
  if (CONTENT.copy[base]) return { copy: CONTENT.copy[base], translated: true };
  return { copy: CONTENT.copy.en, translated: base === 'en' };
}

/** The Strapi payload for one entry in one locale. */
function payloadFor(entry, copy) {
  const text = copy.entries[entry.Taxonomy_Name];
  return {
    Taxonomy_Name: entry.Taxonomy_Name,
    Level: entry.Level,
    Headline: text.Headline,
    Intro: copy.Intro,
    Examples_Heading: copy.Examples_Heading,
    Damage_Examples: entry.Damage_Examples.map((ex, i) => ({
      Title: text.Damage_Examples[i].Title,
      Description: text.Damage_Examples[i].Description,
      Cover_Type: ex.Cover_Type,
      Icon: ex.Icon,
    })),
  };
}

const keyOf = (name, level) => `${String(name).trim().toLowerCase()}|${level}`;

function check(locales) {
  let fallbacks = 0;
  for (const code of locales) {
    const { copy, translated } = copyForLocale(code);
    const missing = CONTENT.entries.filter((e) => !copy.entries[e.Taxonomy_Name]);
    if (!translated) {
      fallbacks += CONTENT.entries.length;
      console.log(`✗ ${code}: no translation — all ${CONTENT.entries.length} entries would be English`);
    } else if (missing.length) {
      fallbacks += missing.length;
      console.log(`✗ ${code}: ${missing.length} entries missing (${missing.map((e) => e.Taxonomy_Name).join(', ')})`);
    } else {
      console.log(`✓ ${code}: all ${CONTENT.entries.length} entries translated`);
    }
  }
  console.log(`\n${fallbacks} locale × entry combinations on English fallback.`);
  return fallbacks;
}

async function listGeneric(token, locale) {
  const found = new Map();
  for (let page = 1; ; page++) {
    const res = await request('GET', `${CM_BASE}?page=${page}&pageSize=100&locale=${locale}`, null, token);
    if (res.status !== 200) throw new Error(`Listing category offers failed: ${JSON.stringify(res.body)}`);
    for (const doc of res.body.results || []) {
      if (doc.Client) continue; // client overrides are editor-owned
      found.set(keyOf(doc.Taxonomy_Name, doc.Level), doc.documentId);
    }
    const { pageCount = 1 } = res.body.pagination || {};
    if (page >= pageCount) return found;
  }
}

async function main() {
  if (CHECK) {
    process.exit(check(SUPPORTED_LOCALES) ? 1 : 0);
  }
  if (!EMAIL || !PASSWORD) {
    console.error('Usage: node seed-category-offers.js <adminEmail> <adminPassword> [--force] [--publish]');
    console.error('       node seed-category-offers.js --check');
    process.exit(1);
  }

  console.log(`Connecting to Strapi at ${BASE_URL}…`);
  const loginRes = await request('POST', '/admin/login', { email: EMAIL, password: PASSWORD });
  if (loginRes.status !== 200) {
    console.error('Login failed:', JSON.stringify(loginRes.body));
    process.exit(1);
  }
  const token = loginRes.body?.data?.token;

  const localesRes = await request('GET', '/i18n/locales', null, token);
  const locales = localesRes.body;
  const defaultLocale = locales.find((l) => l.isDefault) || locales[0];
  const ordered = [defaultLocale, ...locales.filter((l) => l.code !== defaultLocale.code)];
  console.log(`Locales: ${ordered.map((l) => l.code).join(', ')} (default ${defaultLocale.code})`);

  const existing = await listGeneric(token, defaultLocale.code);
  const counts = { created: 0, updated: 0, skipped: 0, readFailed: 0, failed: 0, published: 0 };

  for (const entry of CONTENT.entries) {
    const key = keyOf(entry.Taxonomy_Name, entry.Level);
    let documentId = existing.get(key);
    console.log(`\n${entry.Taxonomy_Name} (${entry.Level})`);

    for (const locale of ordered) {
      const { copy, translated } = copyForLocale(locale.code);
      // The locale MUST be in the body: Strapi's content-manager reads it from the body for
      // create, update and publish, so a query-only locale writes the default locale every time.
      const body = { ...payloadFor(entry, copy), locale: locale.code };
      const label = `${locale.code}${translated ? '' : ' (English fallback)'}`;

      if (!documentId) {
        const res = await request('POST', `${CM_BASE}?locale=${locale.code}`, body, token);
        if (res.status >= 200 && res.status < 300) {
          documentId = res.body?.data?.documentId;
          existing.set(key, documentId);
          counts.created++;
          console.log(`  ✓ ${label} — created`);
        } else {
          counts.failed++;
          console.warn(`  ✗ ${label} create failed:`, JSON.stringify(res.body));
          break; // no document to attach the other locales to
        }
      } else {
        let hasCopy = false;
        if (!FORCE) {
          // Only a confirmed-missing localization may be written: a failed read is not
          // permission to overwrite, or one 503 would replace an editor's copy.
          const cur = await request('GET', `${CM_BASE}/${documentId}?locale=${locale.code}`, null, token);
          const data = cur.body?.data;
          if (cur.status >= 200 && cur.status < 300) {
            hasCopy = data?.locale === locale.code && Boolean(data?.Headline);
          } else if (cur.status !== 404) {
            counts.readFailed++;
            console.warn(`  ! ${label} — skipped: could not read the current entry (HTTP ${cur.status}). Re-run, or pass --force.`);
            continue;
          }
        }
        if (hasCopy) {
          // Editor copy wins; --publish still publishes it below.
          counts.skipped++;
          console.log(`  – ${label} — already has copy (use --force to overwrite)`);
        } else {
          const res = await request('PUT', `${CM_BASE}/${documentId}?locale=${locale.code}`, body, token);
          if (res.status >= 200 && res.status < 300) {
            counts.updated++;
            console.log(`  ✓ ${label} — saved`);
          } else {
            counts.failed++;
            console.warn(`  ✗ ${label} save failed:`, JSON.stringify(res.body));
            continue;
          }
        }
      }

      if (PUBLISH && documentId) {
        const pub = await request('POST', `${CM_BASE}/${documentId}/actions/publish?locale=${locale.code}`, { locale: locale.code }, token);
        if (pub.status >= 200 && pub.status < 300) counts.published++;
        else console.warn(`  ✗ ${label} publish failed:`, JSON.stringify(pub.body));
      }
    }
  }

  console.log(
    `\nDone: ${counts.created} created, ${counts.updated} saved, ${counts.skipped} skipped, ` +
      `${counts.readFailed} unreadable (skipped), ${counts.failed} failed, ${counts.published} published.`,
  );
  if (!PUBLISH) console.log('Entries are drafts. Review them against the IPIDs, then re-run with --publish.');
  console.log('\nLocale coverage:');
  check(ordered.map((l) => l.code));
  if (counts.failed || counts.readFailed) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
