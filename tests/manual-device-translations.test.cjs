'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const translations = require('../content/manual-device-translations.json');
const schema = require('../src/api/device-input/content-types/device-input/schema.json');
const displayDevice = require('../src/api/display-device/content-types/display-device/schema.json');

test('the optional-field suffix is localized on display-device too', () => {
  // /product reads its labels from display-device, and marks its serial box
  // optional with the same word the manual page uses.
  assert.equal(displayDevice.attributes.Optional_Suffix?.pluginOptions?.i18n?.localized, true);
});

test('every manual-entry translation has a localized CMS field and every language the same keys', () => {
  for (const [language, values] of Object.entries(translations)) {
    assert.deepEqual(Object.keys(values).sort(), Object.keys(translations.en).sort(), language);
    for (const [key, value] of Object.entries(values)) {
      assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, key);
      assert.ok(value.trim(), `${language}/${key}`);
    }
  }
});

test('every device-input CMS key the manual entry page asks for exists in the Strapi schema', () => {
  // The page renders t('Key', 'English fallback'); a key with no field in the
  // schema can never be translated, which is exactly the bug this file fixes.
  const frontend = process.env.FRONTEND_ROOT || path.resolve(__dirname, '../../frontend');
  const file = path.join(frontend, 'app/lookup/manual/ManualDevicePageContent.tsx');
  if (!fs.existsSync(file)) {
    console.warn(`Skipping: frontend checkout not found at ${frontend}. Set FRONTEND_ROOT.`);
    return;
  }
  const source = fs.readFileSync(file, 'utf8');
  const keys = [...source.matchAll(/(?<![A-Za-z])t\('([A-Za-z_]+)'/g)].map((m) => m[1]);
  assert.ok(keys.length, 'no CMS keys found — did the page stop using t()?');
  for (const key of keys) assert.ok(schema.attributes[key], `Missing CMS field: ${key}`);
});
