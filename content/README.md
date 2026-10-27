# Basket translations

The basket schema includes all labels used by the current basket UI. The additive seed imports `content/basket-translations.json` alongside the existing basket labels. The new copy covers English, Spanish, Italian, French, German, Dutch, Turkish, and Portuguese; regional locales reuse their base language, as in the existing seed.

After deploying/restarting Strapi with the updated schema, populate and publish the basket localizations with the existing admin seed:

    node seed-missing-translations.js <adminEmail> <adminPassword> --only=basket

Do not use `--force` for a routine rollout: existing editor content is preserved. These source changes alone do not update a running remote CMS. Product names, descriptions, benefits, exclusions, and policy links still require published localized proposition entries for each Product_ID. Category_labels is a localized JSON mapping from taxonomy names to customer-facing names; extend it for additional categories. Non-English pages omit unmapped category badges instead of displaying English taxonomy keys.

Optional business copy (Cover_starts, Cancellation_note, Price_note, Basket_subtitle) stays blank until supplied by an editor. No promises about coverage or cancellation are invented by the seed.

Check translation placeholders and frontend/schema coverage:

    node --test tests/basket-translations.test.cjs

Set FRONTEND_ROOT if the frontend is not at C:/frontend (the default sibling checkout layout).

# Category offer copy

`content/category-offers.json` holds the offer-page headline, intro and damage examples for each taxonomy category, plus group- and sector-level fallbacks (`category-offer` collection). `Taxonomy_Name` must match the Mongo `Category` collection's spelling exactly: it is the key the backend's `/category_offer` lookup matches on. Text is keyed by base language and lines up with the shared `entries` by example position.

After deploying Strapi with the new schema, check every supported locale is translated, then seed the entries as drafts:

    node seed-category-offers.js --check
    node seed-category-offers.js <adminEmail> <adminPassword>

Damage examples describe what the cover pays for, so review each locale against the product IPIDs before publishing (`--publish`, or publish in the admin). Examples marked `accidental` show only for plans whose proposition sets `Covers_Accidental_Damage`; set that flag on every Prop that covers accidental damage. Existing copy is never overwritten without `--force`, and client-specific overrides (entries with `Client` set) are left to editors.

    node --test tests/category-offers.test.cjs
