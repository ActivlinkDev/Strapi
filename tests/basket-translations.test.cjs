'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const translations = require('../content/basket-translations.json');
const schema = require('../src/api/basket/content-types/basket/schema.json');
const placeholders = (value) => [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test('every basket translation has a localized CMS field and matching placeholders', () => {
  for (const [language, values] of Object.entries(translations)) {
    assert.deepEqual(Object.keys(values).sort(), Object.keys(translations.en).sort(), language);
    for (const [key, value] of Object.entries(values)) {
      assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, key);
      if (key === 'Category_labels') {
        assert.deepEqual(Object.keys(value), Object.keys(translations.en[key]), language);
        for (const label of Object.values(value)) assert.ok(label.trim());
      } else {
        assert.ok(value.trim(), `${language}/${key}`);
        assert.deepEqual(placeholders(value), placeholders(translations.en[key]), `${language}/${key}`);
      }
    }
  }
});

test('every frontend basket CMS reference is present in the Strapi schema', () => {
  const frontend = process.env.FRONTEND_ROOT || path.resolve(__dirname, '../../../../frontend');
  const source = fs.readFileSync(path.join(frontend, 'app/basket/BasketContent.tsx'), 'utf8');
  const keys = [...source.matchAll(/(?:cms\.|cmsRef\.current\.)([A-Za-z_]+)/g)].map((m) => m[1]);
  for (const key of keys) assert.ok(schema.attributes[key], `Missing CMS field: ${key}`);
});
