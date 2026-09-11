# Basket translations

The basket schema includes all labels used by the current basket UI. The additive seed imports `content/basket-translations.json` alongside the existing basket labels. The new copy covers English, Spanish, Italian, French, German, Dutch, Turkish, and Portuguese; regional locales reuse their base language, as in the existing seed.

After deploying/restarting Strapi with the updated schema, populate and publish the basket localizations with the existing admin seed:

    node seed-missing-translations.js <adminEmail> <adminPassword> --only=basket

Do not use `--force` for a routine rollout: existing editor content is preserved. These source changes alone do not update a running remote CMS. Product names, descriptions, benefits, exclusions, and policy links still require published localized proposition entries for each Product_ID. Category_labels is a localized JSON mapping from taxonomy names to customer-facing names; extend it for additional categories. Non-English pages omit unmapped category badges instead of displaying English taxonomy keys.

Optional business copy (Cover_starts, Cancellation_note, Price_note, Basket_subtitle) stays blank until supplied by an editor. No promises about coverage or cancellation are invented by the seed.

Check translation placeholders and frontend/schema coverage:

    node --test tests/basket-translations.test.cjs

Set FRONTEND_ROOT if the frontend is not at C:/frontend (the default sibling checkout layout).

# Manual device entry translations

`content/manual-device-translations.json` carries the copy for the manual device entry page (`/lookup/manual`) and is merged into the `device-input` single type by the additive seed. Those labels — product type, manufacturer guarantee, the placeholders, the serial hint and the page heading — had no CMS fields at all, so every locale rendered the English fallbacks compiled into the page.

The heading and subheading use their own `Manual_*` keys rather than the shared `Heading`, which belongs to the make/model search page and reads "Enter your product details" there.

After deploying/restarting Strapi with the updated schema, populate and publish the localizations:

    node seed-missing-translations.js <adminEmail> <adminPassword> --only=device-input

The seed is additive: it fills empty fields only. Where a live locale already holds a wrong value (for example a machine translation of the key name rather than the copy), the seed leaves it alone — correct it in the admin UI, or re-run that single type with `--force` to overwrite from this file.

Check schema and frontend coverage:

    node --test tests/manual-device-translations.test.cjs

Set FRONTEND_ROOT if the frontend is not a sibling checkout.
