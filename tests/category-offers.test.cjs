'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');

const CONTENT = require('../content/category-offers.json');
const schema = require('../src/api/category-offer/content-types/category-offer/schema.json');
const component = require('../src/components/offer/damage-example.json');

const LEVELS = schema.attributes.Level.enum;
const COVER_TYPES = component.attributes.Cover_Type.enum;
const ICONS = component.attributes.Icon.enum;
// Base languages the storefront locales (en_GB, es_ES, it_IT, fr_FR, de_DE, fr_BE, nl_BE) resolve to.
const REQUIRED_LANGUAGES = ['en', 'es', 'it', 'fr', 'de', 'nl'];

test('every entry is unique and uses values the schema accepts', () => {
  const seen = new Set();
  for (const entry of CONTENT.entries) {
    const key = `${entry.Taxonomy_Name.toLowerCase()}|${entry.Level}`;
    assert.ok(!seen.has(key), `duplicate entry ${key}`);
    seen.add(key);
    assert.ok(LEVELS.includes(entry.Level), `${entry.Taxonomy_Name}: level ${entry.Level}`);
    assert.ok(entry.Damage_Examples.length > 0, `${entry.Taxonomy_Name}: no examples`);
    for (const ex of entry.Damage_Examples) {
      assert.ok(COVER_TYPES.includes(ex.Cover_Type), `${entry.Taxonomy_Name}: cover type ${ex.Cover_Type}`);
      assert.ok(ICONS.includes(ex.Icon), `${entry.Taxonomy_Name}: icon ${ex.Icon}`);
    }
  }
});

test('every supported language has complete, aligned copy for every entry', () => {
  for (const language of REQUIRED_LANGUAGES) {
    const copy = CONTENT.copy[language];
    assert.ok(copy, `no copy for ${language}`);
    assert.ok(copy.Intro?.trim() && copy.Examples_Heading?.trim(), `${language}: shared copy`);
    for (const entry of CONTENT.entries) {
      const text = copy.entries[entry.Taxonomy_Name];
      assert.ok(text?.Headline?.trim(), `${language}/${entry.Taxonomy_Name}: headline`);
      assert.equal(text.Damage_Examples.length, entry.Damage_Examples.length, `${language}/${entry.Taxonomy_Name}: example count`);
      for (const [i, ex] of text.Damage_Examples.entries()) {
        assert.ok(ex.Title?.trim() && ex.Description?.trim(), `${language}/${entry.Taxonomy_Name}[${i}]`);
      }
    }
  }
});

test('copy only names entries that exist', () => {
  const names = new Set(CONTENT.entries.map((e) => e.Taxonomy_Name));
  for (const [language, copy] of Object.entries(CONTENT.copy)) {
    for (const name of Object.keys(copy.entries)) assert.ok(names.has(name), `${language}: unknown entry ${name}`);
  }
});
