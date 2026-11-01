'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const LABELS = require('../content/frontend-labels.json');

const schemaFor = (type) => require(`../src/api/${type}/content-types/${type}/schema.json`);
const LANGUAGES = ['en', 'es', 'it', 'fr', 'de', 'nl', 'tr', 'pt'];

function sourceFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, found);
    else if (/\.tsx?$/.test(entry.name)) found.push(full);
  }
  return found;
}

test('every label is a localized field with a value in every seeded language', () => {
  for (const [type, byLanguage] of Object.entries(LABELS)) {
    assert.deepEqual(Object.keys(byLanguage).sort(), [...LANGUAGES].sort(), type);
    const schema = schemaFor(type);
    for (const key of Object.keys(byLanguage.en)) {
      assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, `${type}.${key} localized`);
      for (const language of LANGUAGES) {
        const value = byLanguage[language][key];
        assert.ok(typeof value === 'string' && value.trim(), `${type}/${language}/${key}`);
        if (schema.attributes[key].type === 'string') assert.ok(value.length <= 255, `${type}/${language}/${key} too long`);
      }
    }
  }
});

test('the seed script loads these labels', () => {
  const seed = fs.readFileSync(path.join(__dirname, '../seed-missing-translations.js'), 'utf8');
  assert.ok(seed.includes("require('./content/frontend-labels.json')"));
});

// The other direction: a useCmsLabels key with no Strapi field never leaves the
// English fallback in the code, whichever locale the customer picked.
test('every useCmsLabels key the frontend asks for has a Strapi field', { skip: !process.env.FRONTEND_ROOT && 'set FRONTEND_ROOT to check against the frontend' }, () => {
  const root = process.env.FRONTEND_ROOT;
  const files = ['app', 'components', 'lib'].flatMap((dir) => sourceFiles(path.join(root, dir)));
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const bind of source.matchAll(/const \{([^}]*)\}\s*=\s*useCmsLabels\(\s*['"]([\w-]+)['"]/g)) {
      const name = bind[1].match(/\bt\s*:\s*(\w+)/)?.[1] || (/\bt\b/.test(bind[1]) ? 't' : null);
      if (!name) continue;
      const schema = schemaFor(bind[2]);
      for (const use of source.matchAll(new RegExp(`(?<![\\w.])${name}\\(\\s*['"]([\\w-]+)['"]`, 'g'))) {
        assert.ok(schema.attributes[use[1]], `${bind[2]} is missing ${use[1]} (${path.relative(root, file)})`);
      }
    }
  }
});
