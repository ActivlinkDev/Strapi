'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// The backend (embedding routers/comms) falls back to English for any blank
// field, but a broken placeholder would reach customers verbatim, so every
// language must carry exactly the English placeholders.
const placeholders = (value) => (value.match(/\{[^{}]+\}/g) || []).sort().join(',');

const translations = require('../translations/email-copy.json');
const schema = require('../src/api/email-copy/content-types/email-copy/schema.json');
const keys = Object.keys(translations.en);

test('email-copy: schema fields match the English keys and are localized', () => {
  assert.deepEqual(Object.keys(schema.attributes).sort(), [...keys].sort());
  for (const key of keys) {
    assert.equal(schema.attributes[key].pluginOptions?.i18n?.localized, true, key);
  }
});

test('email-copy: every language has every key with the English placeholders', () => {
  for (const [language, values] of Object.entries(translations)) {
    assert.deepEqual(Object.keys(values).sort(), [...keys].sort(), language);
    for (const key of keys) {
      assert.ok(typeof values[key] === 'string' && values[key].trim(), `${language}/${key}`);
      assert.equal(placeholders(values[key]), placeholders(translations.en[key]), `${language}/${key}`);
    }
  }
});

// /my-contracts reads these for its "verify by email" option (frontend
// app/my-contracts/MyContractsClient.tsx DEFAULT_LABELS).
const EMAIL_VERIFY_KEYS = ['Use_email_instead', 'Use_phone_instead', 'Email_label', 'Email_code_to',
  'Change_email_or_phone', 'Use_different_email', 'Error_rate_limited'];

test('my-contracts: email verification labels are localized in every seeded language', () => {
  const seedSource = fs.readFileSync(path.join(__dirname, '../seed-missing-translations.js'), 'utf8');
  const start = seedSource.indexOf('const CONTENT = ') + 'const CONTENT = '.length;
  const CONTENT = JSON.parse(seedSource.slice(start, seedSource.indexOf('\n};\n', start) + 2));
  const contractsSchema = require('../src/api/my-contracts/content-types/my-contracts/schema.json');
  for (const key of EMAIL_VERIFY_KEYS) {
    assert.equal(contractsSchema.attributes[key]?.pluginOptions?.i18n?.localized, true, key);
    for (const [language, values] of Object.entries(CONTENT['my-contracts'])) {
      assert.ok(typeof values[key] === 'string' && values[key].trim(), `${language}/${key}`);
      assert.equal(placeholders(values[key]), placeholders(CONTENT['my-contracts'].en[key]), `${language}/${key}`);
    }
  }
});
