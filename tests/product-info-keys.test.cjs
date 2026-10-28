'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// CONTENT lives inline in the seed script; read it the same way the seed does.
const seedSource = fs.readFileSync(path.join(__dirname, '../seed-missing-translations.js'), 'utf8');
const start = seedSource.indexOf('const CONTENT = ') + 'const CONTENT = '.length;
const CONTENT = JSON.parse(seedSource.slice(start, seedSource.indexOf('\n};\n', start) + 2));

const schema = require('../src/api/display-device/content-types/display-device/schema.json');

// The product info sheet/tabs and the price guide on the frontend's /product page
// and search confirm popup (components/ProductInfoTabs.tsx, PriceGuide.tsx) read
// these from display-device.
const PRODUCT_INFO_KEYS = [
  'More_about_product', 'Overview', 'Documents', 'Search_specifications', 'No_matching_specifications',
  'Price_guide', 'Price_guide_hint', 'Price_guide_link', 'Price_guide_intro', 'Typical_price', 'Retailer_prices',
];

test('product info keys are localized display-device fields with a value in every seeded language', () => {
  for (const key of PRODUCT_INFO_KEYS) {
    assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, `display-device.${key} localized`);
    for (const [language, values] of Object.entries(CONTENT['display-device'])) {
      assert.ok(typeof values[key] === 'string' && values[key].trim(), `display-device/${language}/${key}`);
    }
  }
});

test('display-device defines every label the frontend product surfaces ask for', { skip: !process.env.FRONTEND_ROOT && 'set FRONTEND_ROOT to check against the frontend' }, () => {
  const files = ['components/ProductInfoTabs.tsx', 'components/PriceGuide.tsx', 'components/PriceComparisonModal.tsx', 'components/ProductCard.tsx', 'components/ProductConfirmModal.tsx'];
  for (const file of files) {
    const source = fs.readFileSync(path.join(process.env.FRONTEND_ROOT, file), 'utf8');
    for (const [, key] of source.matchAll(/getLabel\(\s*'([A-Za-z_]+)'/g)) {
      assert.ok(schema.attributes[key], `${file} asks for display-device.${key}, which Strapi does not define`);
    }
  }
});
