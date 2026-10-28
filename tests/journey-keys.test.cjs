'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// CONTENT lives inline in the seed script; read it the same way the seed does.
const seedSource = fs.readFileSync(path.join(__dirname, '../seed-missing-translations.js'), 'utf8');
const start = seedSource.indexOf('const CONTENT = ') + 'const CONTENT = '.length;
const CONTENT = JSON.parse(seedSource.slice(start, seedSource.indexOf('\n};\n', start) + 2));

const schemaFor = (type) => require(`../src/api/${type}/content-types/${type}/schema.json`);

// The customer-journey progress bar (frontend components/journey/ui.tsx,
// JourneySteps) and the repair journey's (app/assistance/shell.tsx) read these
// from shared-ui; the offer page reads Upfront_pricing
// and the category damage-examples heading and disclaimer.
const JOURNEY_KEYS = {
  'shared-ui': ['Progress_Label', 'Step_Find', 'Step_Details', 'Step_Cover', 'Step_Verify', 'Step_Pay',
    'Step_Device', 'Step_Fault', 'Step_Options', 'Step_Date'],
  'display-offer': ['Upfront_pricing', 'Examples_Heading', 'Examples_Disclaimer'],
};

test('journey keys are localized fields with a value in every seeded language', () => {
  for (const [type, keys] of Object.entries(JOURNEY_KEYS)) {
    const schema = schemaFor(type);
    for (const key of keys) {
      assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, `${type}.${key} localized`);
      for (const [language, values] of Object.entries(CONTENT[type])) {
        assert.ok(typeof values[key] === 'string' && values[key].trim(), `${type}/${language}/${key}`);
      }
    }
  }
});

test('the frontend progress bar asks shared-ui for exactly these keys', { skip: !process.env.FRONTEND_ROOT && 'set FRONTEND_ROOT to check against the frontend' }, () => {
  const source = ['components/journey/ui.tsx', 'app/assistance/shell.tsx']
    .map((file) => fs.readFileSync(path.join(process.env.FRONTEND_ROOT, file), 'utf8'))
    .join('\n');
  const asked = new Set([...source.matchAll(/'(Progress_Label|Step_[A-Za-z]+)'/g)].map((m) => m[1]));
  for (const key of asked) assert.ok(JOURNEY_KEYS['shared-ui'].includes(key), `shared-ui is missing ${key}`);
});
