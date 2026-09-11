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
    Data_Protection_Heading: 'How we use your data',
    Data_Protection_Text: 'We use the details you provide to register your product, provide your cover and contact you about it. We keep your data only for as long as we need it, never sell it, and share it only with the partners who deliver your cover. You can ask to see, correct or delete your data at any time — see our privacy notice for details.',
    Marketing_Heading: 'Marketing preferences',
    Marketing_Intro: 'Tell us how you would like to hear from us about products, offers and updates. Leave them all unticked if you would rather not. You can change your mind at any time.',
    Marketing_Channel_Email: 'Email',
    Marketing_Channel_SMS: 'SMS / text message',
    Marketing_Channel_Phone: 'Phone',
    Marketing_Channel_Post: 'Post',
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
    Data_Protection_Heading: 'Cómo usamos tus datos',
    Data_Protection_Text: 'Utilizamos los datos que nos facilitas para registrar tu producto, prestarte la cobertura y ponernos en contacto contigo al respecto. Conservamos tus datos solo el tiempo necesario, nunca los vendemos y los compartimos únicamente con los socios que prestan tu cobertura. Puedes solicitar acceder, corregir o eliminar tus datos en cualquier momento; consulta nuestro aviso de privacidad para más información.',
    Marketing_Heading: 'Preferencias de marketing',
    Marketing_Intro: 'Indícanos cómo quieres que te informemos sobre productos, ofertas y novedades. Déjalas todas sin marcar si prefieres no recibirlas. Puedes cambiar de opinión cuando quieras.',
    Marketing_Channel_Email: 'Correo electrónico',
    Marketing_Channel_SMS: 'SMS / mensaje de texto',
    Marketing_Channel_Phone: 'Teléfono',
    Marketing_Channel_Post: 'Correo postal',
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
    Data_Protection_Heading: 'Come utilizziamo i tuoi dati',
    Data_Protection_Text: 'Utilizziamo i dati che ci fornisci per registrare il tuo prodotto, erogare la tua copertura e contattarti in merito. Conserviamo i tuoi dati solo per il tempo necessario, non li vendiamo mai e li condividiamo esclusivamente con i partner che erogano la tua copertura. Puoi chiedere di consultare, correggere o cancellare i tuoi dati in qualsiasi momento: consulta la nostra informativa sulla privacy per maggiori dettagli.',
    Marketing_Heading: 'Preferenze di marketing',
    Marketing_Intro: 'Indicaci come preferisci ricevere informazioni su prodotti, offerte e novità. Lascia tutto deselezionato se preferisci non riceverle. Puoi cambiare idea in qualsiasi momento.',
    Marketing_Channel_Email: 'Email',
    Marketing_Channel_SMS: 'SMS / messaggio di testo',
    Marketing_Channel_Phone: 'Telefono',
    Marketing_Channel_Post: 'Posta',
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
    Data_Protection_Heading: 'Comment nous utilisons vos données',
    Data_Protection_Text: 'Nous utilisons les informations que vous nous communiquez pour enregistrer votre produit, vous fournir votre garantie et vous contacter à ce sujet. Nous ne conservons vos données que le temps nécessaire, ne les vendons jamais et ne les partageons qu\'avec les partenaires qui assurent votre garantie. Vous pouvez demander à consulter, corriger ou supprimer vos données à tout moment — consultez notre politique de confidentialité pour en savoir plus.',
    Marketing_Heading: 'Préférences marketing',
    Marketing_Intro: 'Indiquez-nous comment vous souhaitez recevoir nos informations sur les produits, les offres et les nouveautés. Laissez tout décoché si vous préférez ne rien recevoir. Vous pouvez changer d\'avis à tout moment.',
    Marketing_Channel_Email: 'E-mail',
    Marketing_Channel_SMS: 'SMS',
    Marketing_Channel_Phone: 'Téléphone',
    Marketing_Channel_Post: 'Courrier postal',
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
    Data_Protection_Heading: 'Wie wir Ihre Daten verwenden',
    Data_Protection_Text: 'Wir verwenden die von Ihnen angegebenen Daten, um Ihr Produkt zu registrieren, Ihren Schutz bereitzustellen und Sie dazu zu kontaktieren. Wir speichern Ihre Daten nur so lange wie nötig, verkaufen sie niemals und geben sie ausschließlich an die Partner weiter, die Ihren Schutz erbringen. Sie können jederzeit Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen — Näheres finden Sie in unserer Datenschutzerklärung.',
    Marketing_Heading: 'Marketing-Einstellungen',
    Marketing_Intro: 'Sagen Sie uns, wie Sie über Produkte, Angebote und Neuigkeiten informiert werden möchten. Lassen Sie alles leer, wenn Sie keine Informationen wünschen. Sie können Ihre Auswahl jederzeit ändern.',
    Marketing_Channel_Email: 'E-Mail',
    Marketing_Channel_SMS: 'SMS / Textnachricht',
    Marketing_Channel_Phone: 'Telefon',
    Marketing_Channel_Post: 'Post',
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
    Data_Protection_Heading: 'Hoe wij uw gegevens gebruiken',
    Data_Protection_Text: 'Wij gebruiken de gegevens die u opgeeft om uw product te registreren, uw dekking te leveren en hierover contact met u op te nemen. Wij bewaren uw gegevens niet langer dan nodig, verkopen ze nooit en delen ze uitsluitend met de partners die uw dekking verzorgen. U kunt op elk moment vragen om inzage, correctie of verwijdering van uw gegevens — zie onze privacyverklaring voor meer informatie.',
    Marketing_Heading: 'Marketingvoorkeuren',
    Marketing_Intro: 'Laat ons weten hoe u van ons wilt horen over producten, aanbiedingen en nieuws. Laat alles uitgevinkt als u liever niets ontvangt. U kunt zich altijd bedenken.',
    Marketing_Channel_Email: 'E-mail',
    Marketing_Channel_SMS: 'Sms / tekstbericht',
    Marketing_Channel_Phone: 'Telefoon',
    Marketing_Channel_Post: 'Post',
  },
  tr: {
    Header_banner: 'Müşteri Doğrulama',
    Confirm_details: 'Bilgilerinizi onaylayın',
    Header_prompt: 'Tek kullanımlık kod almak için telefon numaranızı ve aşağıya e-posta adresinizi girin.',
    First_name: 'Ad',
    Last_name: 'Soyad',
    Email: 'E-posta Adresi',
    Email_placeholder: 'siz@ornek.com',
    Telephone_Number: 'Telefon Numarası',
    OTP_Message: 'Kodu Girin',
    Send_Code: 'Kodu Gönder →',
    Back: 'Geri',
    Please_Wait: 'Lütfen bekleyin…',
    We_Sent_Label: 'Şu numaraya bir kod gönderdik:',
    Enter_Below: 'Aşağıya girin.',
    Verify: 'Doğrula →',
    Resend_Code: 'Kodu tekrar gönder',
    Use_Different_Number: 'Farklı bir numara kullan',
    Verifying: 'Doğrulanıyor…',
    Resend_Wait: 'Kodu {seconds} saniye içinde tekrar gönderebilirsiniz',
    Continue: 'Devam et →',
    Validated_Heading: 'Doğrulandı',
    Validated_Message_Phone: 'Teşekkürler. Telefon numaranız doğrulandı.',
    Validated_Message_Email: 'Teşekkürler. E-posta adresiniz doğrulandı.',
    Creating_Customer: 'Müşteri oluşturuluyor…',
    Register_Another: 'Başka bir ürün kaydedin',
    Data_Protection_Heading: 'Verilerinizi nasıl kullanıyoruz',
    Data_Protection_Text: 'Verdiğiniz bilgileri ürününüzü kaydetmek, teminatınızı sağlamak ve bu konuda sizinle iletişim kurmak için kullanırız. Verilerinizi yalnızca gerekli olduğu sürece saklarız, asla satmayız ve yalnızca teminatınızı sağlayan iş ortaklarıyla paylaşırız. Verilerinizi görmeyi, düzeltmeyi veya silmeyi dilediğiniz zaman talep edebilirsiniz — ayrıntılar için gizlilik bildirimimize bakın.',
    Marketing_Heading: 'Pazarlama tercihleri',
    Marketing_Intro: 'Ürünler, kampanyalar ve güncellemeler hakkında sizinle nasıl iletişim kurmamızı istediğinizi bize bildirin. Tercih etmiyorsanız hiçbirini işaretlemeyin. Fikrinizi istediğiniz zaman değiştirebilirsiniz.',
    Marketing_Channel_Email: 'E-posta',
    Marketing_Channel_SMS: 'SMS / kısa mesaj',
    Marketing_Channel_Phone: 'Telefon',
    Marketing_Channel_Post: 'Posta',
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
    Data_Protection_Heading: 'Como utilizamos os seus dados',
    Data_Protection_Text: 'Utilizamos os dados que nos fornece para registar o seu produto, prestar a sua cobertura e contactá-lo sobre a mesma. Conservamos os seus dados apenas pelo tempo necessário, nunca os vendemos e partilhamo-los somente com os parceiros que prestam a sua cobertura. Pode solicitar o acesso, a correção ou a eliminação dos seus dados a qualquer momento — consulte o nosso aviso de privacidade para mais informações.',
    Marketing_Heading: 'Preferências de marketing',
    Marketing_Intro: 'Diga-nos como prefere receber informações sobre produtos, ofertas e novidades. Deixe tudo por assinalar se preferir não receber. Pode mudar de ideias a qualquer momento.',
    Marketing_Channel_Email: 'E-mail',
    Marketing_Channel_SMS: 'SMS / mensagem de texto',
    Marketing_Channel_Phone: 'Telefone',
    Marketing_Channel_Post: 'Correio postal',
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
    } else if (pubRes.body?.error?.message === 'already.published') {
      console.log(`✓ ${locale.code} — already published (updated in place).`);
    } else {
      console.warn(`✗ ${locale.code} publish failed:`, JSON.stringify(pubRes.body, null, 2));
    }
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
