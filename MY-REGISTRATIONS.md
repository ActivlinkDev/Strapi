My registrations is a localized single type with 50 required text fields. It includes phone and six-digit code validation messages, network and verification errors, loading and empty states, device details, receipt accessibility text, and singular/plural device counts.

Translations cover English, Spanish, Italian, French, German, Dutch, Turkish and Portuguese. The existing seed command selects the base language for regional locales and uses English for other languages. It fills missing values and preserves existing editorial text.

After Strapi loads the new schema, populate and publish all configured locales:

```sh
node seed-missing-translations.js <adminEmail> <adminPassword> --only=my-registrations
```

The command defaults to local Strapi; set STRAPI_URL to target another instance. Run `node check-my-registrations.js` to validate the translation set and CMS validation rules. Placeholders `{phone}`, `{count}`, `{date}`, `{device}` and `{seconds}` must be preserved; CMS lifecycle validation rejects blank text and changed placeholders while allowing partial updates.

The frontend reads `my-registrations` through the existing authenticated CMS proxy. If its Strapi API token has custom permissions, include `api::my-registrations.my-registrations.find` in that token's allowed actions. No public write access is needed.
