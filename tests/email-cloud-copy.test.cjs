'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');

// The backend (embedding routers/comms) and the frontend cloud page fall back to
// English for any blank field, but a broken placeholder would reach customers
// verbatim, so every language must carry exactly the English placeholders.
const placeholders = (value) => (value.match(/\{[^{}]+\}/g) || []).sort().join(',');

for (const type of ['email-copy', 'cloud-page']) {
  const translations = require(`../translations/${type}.json`);
  const schema = require(`../src/api/${type}/content-types/${type}/schema.json`);
  const keys = Object.keys(translations.en);

  test(`${type}: schema fields match the English keys and are localized`, () => {
    assert.deepEqual(Object.keys(schema.attributes).sort(), [...keys].sort());
    for (const key of keys) {
      assert.equal(schema.attributes[key].pluginOptions?.i18n?.localized, true, key);
    }
  });

  test(`${type}: every language has every key with the English placeholders`, () => {
    for (const [language, values] of Object.entries(translations)) {
      assert.deepEqual(Object.keys(values).sort(), [...keys].sort(), language);
      for (const key of keys) {
        assert.ok(typeof values[key] === 'string' && values[key].trim(), `${language}/${key}`);
        assert.equal(placeholders(values[key]), placeholders(translations.en[key]), `${language}/${key}`);
      }
    }
  });
}
