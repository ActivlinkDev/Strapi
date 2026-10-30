# Email copy and Cloud ID page

Two localized single types back the Brevo confirmation emails and the Cloud ID page those emails link to.

- `email-copy`: wording for the registration confirmation, plan confirmation and email verification code messages. The backend (`embedding/routers/comms`) reads it per locale, fills `{clientName}` and `{firstName}`, and passes it to the Brevo template as `params.copy`.
- `cloud-page`: labels for the frontend `/cloud/[token]` page. `{email}` is replaced with the masked address the code is sent to.

Translations live in `translations/email-copy.json` and `translations/cloud-page.json` (English, Spanish, Italian, French, German, Dutch; other languages fall back to English). After Strapi loads the new schemas, seed and publish every locale:

```sh
node seed-missing-translations.js <adminEmail> <adminPassword> --only=email-copy,cloud-page
```

Lifecycle validation rejects blank text and placeholder changes, the same rules as `my-registrations`. `node --test tests/email-cloud-copy.test.cjs` checks the translation files against the schemas.

Both consumers fall back to built-in English for any field that is missing, so an unpublished locale never blocks an email. The Strapi API token used by the backend (`STRAPI_BEARER_TOKEN`) needs `find` on `api::email-copy.email-copy` and `api::cloud-page.cloud-page` if it has custom permissions.

Per-client branding (logo, colour, sender, Brevo template IDs) is not stored here. It is edited in the admin portal's Email tab and stored on the backend.
