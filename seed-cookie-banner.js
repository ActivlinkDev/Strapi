'use strict';

/**
 * Seed script: populates the cookie-banner single type with English default values.
 * Usage: node seed-cookie-banner.js <adminEmail> <adminPassword>
 * Example: node seed-cookie-banner.js admin@example.com mypassword
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL    = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed-cookie-banner.js <adminEmail> <adminPassword>');
  process.exit(1);
}

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
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

const EN_VALUES = {
  // Consent banner
  Banner_Title: 'We value your privacy',
  Banner_Description:
    'We use cookies to make this site work and, with your permission, to understand how it is used. You can change your choice at any time via Cookie settings.',
  Accept_All_Button: 'Accept all',
  Reject_All_Button: 'Reject non-essential',
  Manage_Preferences_Button: 'Manage preferences',

  // Preferences modal
  Modal_Title: 'Cookie preferences',
  Save_Preferences_Button: 'Save preferences',

  // Categories
  Necessary_Title: 'Strictly necessary',
  Necessary_Description:
    'Required for core functionality such as secure sessions. Always on.',
  Analytics_Title: 'Analytics',
  Analytics_Description: 'Help us understand how the site is used.',
  Marketing_Title: 'Marketing',
  Marketing_Description: 'Used to personalise offers and measure campaigns.',
};

async function main() {
  console.log(`Connecting to Strapi at ${BASE_URL}…`);

  // 1. Log in to get admin JWT
  const loginRes = await request('POST', '/admin/login', { email: EMAIL, password: PASSWORD });
  if (loginRes.status !== 200) {
    console.error('Login failed:', JSON.stringify(loginRes.body));
    process.exit(1);
  }
  const token = loginRes.body?.data?.token;
  console.log('Logged in successfully.');

  // 2. Fetch all configured locales
  const localesRes = await request('GET', '/i18n/locales', null, token);
  const locales = localesRes.body;
  const defaultLocale = locales.find(l => l.isDefault) || locales[0];
  console.log(`Default locale: ${defaultLocale.code}`);
  console.log(`All locales: ${locales.map(l => l.code).join(', ')}`);

  // 3. Write English values to the default locale first
  const cmBase = '/content-manager/single-types/api::cookie-banner.cookie-banner';
  console.log(`\nWriting English values to default locale (${defaultLocale.code})…`);
  const defaultRes = await request('PUT', `${cmBase}?locale=${defaultLocale.code}`, EN_VALUES, token);
  if (defaultRes.status >= 200 && defaultRes.status < 300) {
    console.log(`✓ ${defaultLocale.code} — saved.`);
  } else {
    console.error(`✗ ${defaultLocale.code} failed:`, JSON.stringify(defaultRes.body, null, 2));
    process.exit(1);
  }

  // 4. Create placeholder entries for all other locales (English values as fallback)
  const otherLocales = locales.filter(l => l.code !== defaultLocale.code);
  for (const locale of otherLocales) {
    console.log(`Writing placeholder values to ${locale.code}…`);
    const res = await request('PUT', `${cmBase}?locale=${locale.code}`, EN_VALUES, token);
    if (res.status >= 200 && res.status < 300) {
      console.log(`✓ ${locale.code} — saved.`);
    } else {
      console.warn(`✗ ${locale.code} failed:`, JSON.stringify(res.body, null, 2));
    }
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
