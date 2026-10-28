'use strict';
const assert = require('node:assert/strict');
const translations = require('./translations/my-registrations.json');
const schema = require('./src/api/my-registrations/content-types/my-registrations/schema.json');
const hooks = require('./src/api/my-registrations/content-types/my-registrations/lifecycles');
for (const [locale, data] of Object.entries(translations)) {
  assert.deepEqual(Object.keys(data).sort(), Object.keys(schema.attributes).sort(), locale);
  hooks.beforeCreate({ params: { data } });
}
for (const before of Object.values(hooks)) {
  assert.throws(() => before({ params: { data: { Page_Title: '   ' } } }), /must contain text/);
  assert.throws(() => before({ params: { data: { Verified_for: 'Verified' } } }), /placeholders/);
  assert.throws(() => before({ params: { data: { Uploaded: 'Uploaded {datum}' } } }), /placeholders/);
  assert.doesNotThrow(() => before({ params: { data: { Page_Title: 'Custom title' } } }));
  assert.doesNotThrow(() => before({ params: { data: { Verified_for: '{phone} verified' } } }));
}
console.log(`Validated ${Object.keys(schema.attributes).length} fields in ${Object.keys(translations).length} languages, including blank values, placeholders and partial updates.`);
