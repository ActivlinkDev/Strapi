'use strict';

/**
 * Seed script: populates the validate-customer single type with the actual
 * values used by the frontend (app/validate_customer), localized for the
 * major supported languages. Locales without a dedicated translation fall
 * back to English.
 * Usage: node seed-validate-customer.js <adminEmail> <adminPassword>
 * Example: node seed-validate-customer.js admin@example.com mypassword
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL    = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed-validate-customer.js <adminEmail> <adminPassword>');
  process.exit(1);
}

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// Values keyed by base language. Regional locales (e.g. fr-BE, pt-BR) reuse
// the base language entry; unmatched locales fall back to English.
const VALUES = {
  en: {
    Header_banner: 'Validate Customer',
    Confirm_details: 'Confirm your details',
    Header_prompt: 'Enter your phone number to receive a one-time code and your email address below.',
    First_name: 'First Name',
    Last_name: 'Last Name',
    Email: 'Email Address',
    Email_placeholder: 'you@example.com',
    Telephone_Number: 'Telephone Number',
    OTP_Message: 'Enter Code',
    Send_Code: 'Send Code →',
    Back: 'Back',
    Please_Wait: 'Please wait…',
    We_Sent_Label: 'We sent a code to',
    Enter_Below: 'Enter it below.',
    Verify: 'Verify →',
    Resend_Code: 'Resend code',
    Use_Different_Number: 'Use a different number',
    Verifying: 'Verifying…',
    Resend_Wait: 'Resend code in {seconds}s',
    Continue: 'Continue →',
    Validated_Heading: 'Validated',
    Validated_Message_Phone: 'Thank you. Your phone number has been validated.',
    Validated_Message_Email: 'Thank you. Your email has been validated.',
    Creating_Customer: 'Creating customer…',
    Register_Another: 'Register another product',
  },
  es: {
    Header_banner: 'Validar cliente',
    Confirm_details: 'Confirma tus datos',
    Header_prompt: 'Introduce tu número de teléfono para recibir un código de un solo uso y tu dirección de correo electrónico a continuación.',
    First_name: 'Nombre',
    Last_name: 'Apellidos',
    Email: 'Correo electrónico',
    Email_placeholder: 'tu@ejemplo.com',
    Telephone_Number: 'Número de teléfono',
    OTP_Message: 'Introduce el código',
    Send_Code: 'Enviar código →',
    Back: 'Atrás',
    Please_Wait: 'Espera, por favor…',
    We_Sent_Label: 'Hemos enviado un código a',
    Enter_Below: 'Introdúcelo abajo.',
    Verify: 'Verificar →',
    Resend_Code: 'Reenviar código',
    Use_Different_Number: 'Usar otro número',
    Verifying: 'Verificando…',
    Resend_Wait: 'Reenviar código en {seconds}s',
    Continue: 'Continuar →',
    Validated_Heading: 'Validado',
    Validated_Message_Phone: 'Gracias. Tu número de teléfono ha sido validado.',
    Validated_Message_Email: 'Gracias. Tu correo electrónico ha sido validado.',
    Creating_Customer: 'Creando cliente…',
    Register_Another: 'Registrar otro producto',
  },
  it: {
    Header_banner: 'Convalida cliente',
    Confirm_details: 'Conferma i tuoi dati',
    Header_prompt: 'Inserisci il tuo numero di telefono per ricevere un codice monouso e il tuo indirizzo email qui sotto.',
    First_name: 'Nome',
    Last_name: 'Cognome',
    Email: 'Indirizzo email',
    Email_placeholder: 'tu@esempio.com',
    Telephone_Number: 'Numero di telefono',
    OTP_Message: 'Inserisci il codice',
    Send_Code: 'Invia codice →',
    Back: 'Indietro',
    Please_Wait: 'Attendere prego…',
    We_Sent_Label: 'Abbiamo inviato un codice a',
    Enter_Below: 'Inseriscilo qui sotto.',
    Verify: 'Verifica →',
    Resend_Code: 'Invia di nuovo il codice',
    Use_Different_Number: 'Usa un altro numero',
    Verifying: 'Verifica in corso…',
    Resend_Wait: 'Invia di nuovo il codice tra {seconds}s',
    Continue: 'Continua →',
    Validated_Heading: 'Convalidato',
    Validated_Message_Phone: 'Grazie. Il tuo numero di telefono è stato convalidato.',
    Validated_Message_Email: 'Grazie. Il tuo indirizzo email è stato convalidato.',
    Creating_Customer: 'Creazione del cliente…',
    Register_Another: 'Registra un altro prodotto',
  },
  fr: {
    Header_banner: 'Validation du client',
    Confirm_details: 'Confirmez vos coordonnées',
    Header_prompt: 'Saisissez votre numéro de téléphone pour recevoir un code à usage unique, ainsi que votre adresse e-mail ci-dessous.',
    First_name: 'Prénom',
    Last_name: 'Nom',
    Email: 'Adresse e-mail',
    Email_placeholder: 'vous@exemple.com',
    Telephone_Number: 'Numéro de téléphone',
    OTP_Message: 'Saisissez le code',
    Send_Code: 'Envoyer le code →',
    Back: 'Retour',
    Please_Wait: 'Veuillez patienter…',
    We_Sent_Label: 'Nous avons envoyé un code à',
    Enter_Below: 'Saisissez-le ci-dessous.',
    Verify: 'Vérifier →',
    Resend_Code: 'Renvoyer le code',
    Use_Different_Number: 'Utiliser un autre numéro',
    Verifying: 'Vérification…',
    Resend_Wait: 'Renvoyer le code dans {seconds}s',
    Continue: 'Continuer →',
    Validated_Heading: 'Validé',
    Validated_Message_Phone: 'Merci. Votre numéro de téléphone a été validé.',
    Validated_Message_Email: 'Merci. Votre adresse e-mail a été validée.',
    Creating_Customer: 'Création du client…',
    Register_Another: 'Enregistrer un autre produit',
  },
  de: {
    Header_banner: 'Kunde bestätigen',
    Confirm_details: 'Bestätigen Sie Ihre Angaben',
    Header_prompt: 'Geben Sie unten Ihre Telefonnummer ein, um einen Einmalcode zu erhalten, sowie Ihre E-Mail-Adresse.',
    First_name: 'Vorname',
    Last_name: 'Nachname',
    Email: 'E-Mail-Adresse',
    Email_placeholder: 'sie@beispiel.de',
    Telephone_Number: 'Telefonnummer',
    OTP_Message: 'Code eingeben',
    Send_Code: 'Code senden →',
    Back: 'Zurück',
    Please_Wait: 'Bitte warten…',
    We_Sent_Label: 'Wir haben einen Code gesendet an',
    Enter_Below: 'Geben Sie ihn unten ein.',
    Verify: 'Bestätigen →',
    Resend_Code: 'Code erneut senden',
    Use_Different_Number: 'Andere Nummer verwenden',
    Verifying: 'Wird überprüft…',
    Resend_Wait: 'Code erneut senden in {seconds}s',
    Continue: 'Weiter →',
    Validated_Heading: 'Bestätigt',
    Validated_Message_Phone: 'Vielen Dank. Ihre Telefonnummer wurde bestätigt.',
    Validated_Message_Email: 'Vielen Dank. Ihre E-Mail-Adresse wurde bestätigt.',
    Creating_Customer: 'Kunde wird angelegt…',
    Register_Another: 'Weiteres Produkt registrieren',
  },
  nl: {
    Header_banner: 'Klant valideren',
    Confirm_details: 'Bevestig uw gegevens',
    Header_prompt: 'Voer hieronder uw telefoonnummer in om een eenmalige code te ontvangen, evenals uw e-mailadres.',
    First_name: 'Voornaam',
    Last_name: 'Achternaam',
    Email: 'E-mailadres',
    Email_placeholder: 'u@voorbeeld.com',
    Telephone_Number: 'Telefoonnummer',
    OTP_Message: 'Voer de code in',
    Send_Code: 'Code verzenden →',
    Back: 'Terug',
    Please_Wait: 'Even geduld…',
    We_Sent_Label: 'We hebben een code gestuurd naar',
    Enter_Below: 'Voer deze hieronder in.',
    Verify: 'Verifiëren →',
    Resend_Code: 'Code opnieuw verzenden',
    Use_Different_Number: 'Een ander nummer gebruiken',
    Verifying: 'Bezig met verifiëren…',
    Resend_Wait: 'Code opnieuw verzenden over {seconds}s',
    Continue: 'Doorgaan →',
    Validated_Heading: 'Gevalideerd',
    Validated_Message_Phone: 'Bedankt. Uw telefoonnummer is gevalideerd.',
    Validated_Message_Email: 'Bedankt. Uw e-mailadres is gevalideerd.',
    Creating_Customer: 'Klant wordt aangemaakt…',
    Register_Another: 'Nog een product registreren',
  },
  pt: {
    Header_banner: 'Validar cliente',
    Confirm_details: 'Confirme os seus dados',
    Header_prompt: 'Introduza o seu número de telefone para receber um código de utilização única e o seu endereço de e-mail abaixo.',
    First_name: 'Nome próprio',
    Last_name: 'Apelido',
    Email: 'Endereço de e-mail',
    Email_placeholder: 'voce@exemplo.com',
    Telephone_Number: 'Número de telefone',
    OTP_Message: 'Introduza o código',
    Send_Code: 'Enviar código →',
    Back: 'Voltar',
    Please_Wait: 'Aguarde, por favor…',
    We_Sent_Label: 'Enviámos um código para',
    Enter_Below: 'Introduza-o abaixo.',
    Verify: 'Verificar →',
    Resend_Code: 'Reenviar código',
    Use_Different_Number: 'Usar outro número',
    Verifying: 'A verificar…',
    Resend_Wait: 'Reenviar código em {seconds}s',
    Continue: 'Continuar →',
    Validated_Heading: 'Validado',
    Validated_Message_Phone: 'Obrigado. O seu número de telefone foi validado.',
    Validated_Message_Email: 'Obrigado. O seu endereço de e-mail foi validado.',
    Creating_Customer: 'A criar cliente…',
    Register_Another: 'Registar outro produto',
  },
};

function valuesForLocale(code) {
  const base = String(code || '').toLowerCase().split('-')[0];
  return VALUES[base] || VALUES.en;
}

async function main() {
  console.log(`Connecting to Strapi at ${BASE_URL}…`);

  // 1. Log in to get admin JWT
  const loginRes = await request('POST', '/admin/login', { email: EMAIL, password: PASSWORD });
  if (loginRes.status !== 200) {
    console.error('Login failed:', JSON.stringify(loginRes.body));
    process.exit(1);
  }
  const token = loginRes.body?.data?.token;
  console.log('Logged in successfully.');

  // 2. Fetch all configured locales
  const localesRes = await request('GET', '/i18n/locales', null, token);
  const locales = localesRes.body;
  const defaultLocale = locales.find(l => l.isDefault) || locales[0];
  console.log(`Default locale: ${defaultLocale.code}`);
  console.log(`All locales: ${locales.map(l => l.code).join(', ')}`);

  const uid = 'api::validate-customer.validate-customer';

  // 2b. Only send fields that exist on the target instance's schema, so the
  // script also works against instances that haven't deployed newer fields yet.
  let knownAttrs = null;
  const ctRes = await request('GET', `/content-type-builder/content-types/${uid}`, null, token);
  const attrs = ctRes.body?.data?.schema?.attributes;
  if (attrs && typeof attrs === 'object') {
    knownAttrs = new Set(Object.keys(attrs));
    const missing = Object.keys(VALUES.en).filter(k => !knownAttrs.has(k));
    if (missing.length) {
      console.warn(`Skipping fields not present on this instance: ${missing.join(', ')}`);
    }
  }
  const filterValues = (values) => {
    if (!knownAttrs) return values;
    return Object.fromEntries(Object.entries(values).filter(([k]) => knownAttrs.has(k)));
  };

  // 3. Save then publish values for every locale, default first
  const cmBase = `/content-manager/single-types/${uid}`;
  const ordered = [defaultLocale, ...locales.filter(l => l.code !== defaultLocale.code)];
  for (const locale of ordered) {
    const values = valuesForLocale(locale.code);
    const translated = values !== VALUES.en || String(locale.code).toLowerCase().startsWith('en');
    console.log(`\nWriting ${translated ? 'translated' : 'English fallback'} values to ${locale.code}…`);
    const saveRes = await request('PUT', `${cmBase}?locale=${locale.code}`, filterValues(values), token);
    if (saveRes.status >= 200 && saveRes.status < 300) {
      console.log(`✓ ${locale.code} — saved.`);
    } else {
      console.warn(`✗ ${locale.code} save failed:`, JSON.stringify(saveRes.body, null, 2));
      continue;
    }
    const pubRes = await request('POST', `${cmBase}/actions/publish?locale=${locale.code}`, {}, token);
    if (pubRes.status >= 200 && pubRes.status < 300) {
      console.log(`✓ ${locale.code} — published.`);
    } else {
      console.warn(`✗ ${locale.code} publish failed:`, JSON.stringify(pubRes.body, null, 2));
    }
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
