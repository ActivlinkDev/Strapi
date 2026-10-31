# Email copy

`email-copy` is a localized single type holding the wording for the Brevo registration confirmation, plan confirmation and email verification code messages. The backend (`embedding/routers/comms`) reads it per locale, fills `{clientName}` and `{firstName}`, and passes it to the Brevo template as `params.copy`.

Translations live in `translations/email-copy.json` (English, Spanish, Italian, French, German, Dutch; other languages fall back to English). After Strapi loads the schema, seed and publish every locale:

```sh
node seed-missing-translations.js <adminEmail> <adminPassword> --only=email-copy,my-contracts
```

`my-contracts` is included because it gained labels for verifying by email: `Use_email_instead`, `Use_phone_instead`, `Email_label`, `Email_code_to` (keeps `{email}`), `Change_email_or_phone`, `Use_different_email` and `Error_rate_limited`. The seed only fills blank fields, so existing editorial text is kept.

Lifecycle validation on `email-copy` rejects blank text and placeholder changes, the same rules as `my-registrations`. `node --test tests/email-copy.test.cjs` checks the translations against the schemas.

The backend falls back to built-in English for any field that is missing, so an unpublished locale never blocks an email. The Strapi API token the backend uses (`STRAPI_BEARER_TOKEN`) needs `find` on `api::email-copy.email-copy` if it has custom permissions.

Per-client branding (logo, colour, sender, Brevo template IDs) is not stored here. It is edited in the admin portal's Email tab and stored on the backend.
