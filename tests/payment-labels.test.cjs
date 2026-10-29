'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// CONTENT lives inline in the seed script; read it the same way the seed does.
const seedSource = fs.readFileSync(path.join(__dirname, '../seed-missing-translations.js'), 'utf8');
const start = seedSource.indexOf('const CONTENT = ') + 'const CONTENT = '.length;
const CONTENT = JSON.parse(seedSource.slice(start, seedSource.indexOf('\n};\n', start) + 2));
// Basket copy is seeded from its own file alongside the inline basket values.
const BASKET = require('../content/basket-translations.json');

const schemaFor = (type) => require(`../src/api/${type}/content-types/${type}/schema.json`);

// In-page Stripe payment: the basket payment sheet (frontend app/basket/BasketContent.tsx),
// the offer page's Apple Pay button (app/offer/OfferContent.tsx) and the confirmation
// page's unpaid / still-processing states (app/checkout/success/CheckoutSuccessClient.tsx).
const PAYMENT_KEYS = {
  basket: ['Pay_button', 'Processing_payment', 'Payment_error', 'Payment_sheet_title', 'Or_pay_by_card', 'Email', 'Close'],
  'display-offer': ['Apple_Pay_Label', 'Express_checkout_error', 'Redirecting_to_payment', 'Processing_payment'],
  'checkout-success': ['Not_Paid_Title', 'Not_Paid_Body', 'Back_To_Basket_Button', 'Payment_Processing'],
};

const valuesFor = (type) => (type === 'basket' ? BASKET : CONTENT[type]);

test('payment keys are localized fields with a value in every seeded language', () => {
  for (const [type, keys] of Object.entries(PAYMENT_KEYS)) {
    const schema = schemaFor(type);
    for (const key of keys) {
      assert.equal(schema.attributes[key]?.pluginOptions?.i18n?.localized, true, `${type}.${key} localized`);
      for (const [language, values] of Object.entries(valuesFor(type))) {
        assert.ok(typeof values[key] === 'string' && values[key].trim(), `${type}/${language}/${key}`);
      }
    }
  }
});

test('every Pay_button keeps the {amount} placeholder the frontend fills in', () => {
  for (const [language, values] of Object.entries(BASKET)) {
    assert.deepEqual(values.Pay_button.match(/\{\w+\}/g), ['{amount}'], `basket/${language}/Pay_button`);
  }
});

// The other direction: keys here that the frontend no longer asks for would be dead copy.
test('the frontend asks for every payment key by these names', { skip: !process.env.FRONTEND_ROOT && 'set FRONTEND_ROOT to check against the frontend' }, () => {
  const files = {
    basket: 'app/basket/BasketContent.tsx',
    'display-offer': 'app/offer/OfferContent.tsx',
    'checkout-success': 'app/checkout/success/CheckoutSuccessClient.tsx',
  };
  for (const [type, keys] of Object.entries(PAYMENT_KEYS)) {
    const source = fs.readFileSync(path.join(process.env.FRONTEND_ROOT, files[type]), 'utf8');
    for (const key of keys) {
      const asked = type === 'checkout-success' ? `t("${key}"` : `cms.${key}`;
      assert.ok(source.includes(asked), `${files[type]} does not ask for ${type}.${key}`);
    }
  }
});
