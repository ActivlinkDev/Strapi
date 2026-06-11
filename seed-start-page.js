'use strict';

/**
 * Seed script: populates the start-page single type with the actual values
 * used by the frontend (app/start), localized for the major supported
 * languages. Locales without a dedicated translation fall back to English.
 * Usage: node seed-start-page.js <adminEmail> <adminPassword>
 * Example: node seed-start-page.js admin@example.com mypassword
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL    = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed-start-page.js <adminEmail> <adminPassword>');
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
    Heading: 'Find your product',
    Client_Input_Placeholder: 'Enter clientKey to continue',
    Client_Load_Button: 'Load',
    Scan_Button: 'Scan barcode',
    Search_Placeholder: 'Search by make or model…',
    No_Client_Text: 'Enter or recover a client first to enable search.',
    Searching_Text: 'Searching…',
    Select_Button: 'Select',
    Confirm_Heading: 'Confirm selection',
    Confirm_Subtext: 'Please check make, model and identifiers before continuing.',
    Search_Again_Button: 'Search again',
    Continue_Button: 'Yes – Continue',
  },
  es: {
    Heading: 'Encuentra tu producto',
    Client_Input_Placeholder: 'Introduce la clientKey para continuar',
    Client_Load_Button: 'Cargar',
    Scan_Button: 'Escanear código de barras',
    Search_Placeholder: 'Busca por marca o modelo…',
    No_Client_Text: 'Introduce o recupera primero un cliente para activar la búsqueda.',
    Searching_Text: 'Buscando…',
    Select_Button: 'Seleccionar',
    Confirm_Heading: 'Confirmar selección',
    Confirm_Subtext: 'Comprueba la marca, el modelo y los identificadores antes de continuar.',
    Search_Again_Button: 'Buscar de nuevo',
    Continue_Button: 'Sí – Continuar',
  },
  it: {
    Heading: 'Trova il tuo prodotto',
    Client_Input_Placeholder: 'Inserisci la clientKey per continuare',
    Client_Load_Button: 'Carica',
    Scan_Button: 'Scansiona codice a barre',
    Search_Placeholder: 'Cerca per marca o modello…',
    No_Client_Text: 'Inserisci o recupera prima un cliente per abilitare la ricerca.',
    Searching_Text: 'Ricerca in corso…',
    Select_Button: 'Seleziona',
    Confirm_Heading: 'Conferma la selezione',
    Confirm_Subtext: 'Controlla marca, modello e identificativi prima di continuare.',
    Search_Again_Button: 'Cerca di nuovo',
    Continue_Button: 'Sì – Continua',
  },
  fr: {
    Heading: 'Trouvez votre produit',
    Client_Input_Placeholder: 'Saisissez la clientKey pour continuer',
    Client_Load_Button: 'Charger',
    Scan_Button: 'Scanner le code-barres',
    Search_Placeholder: 'Recherchez par marque ou modèle…',
    No_Client_Text: "Saisissez ou récupérez d'abord un client pour activer la recherche.",
    Searching_Text: 'Recherche en cours…',
    Select_Button: 'Sélectionner',
    Confirm_Heading: 'Confirmer la sélection',
    Confirm_Subtext: 'Vérifiez la marque, le modèle et les identifiants avant de continuer.',
    Search_Again_Button: 'Nouvelle recherche',
    Continue_Button: 'Oui – Continuer',
  },
  de: {
    Heading: 'Finden Sie Ihr Produkt',
    Client_Input_Placeholder: 'clientKey eingeben, um fortzufahren',
    Client_Load_Button: 'Laden',
    Scan_Button: 'Barcode scannen',
    Search_Placeholder: 'Nach Marke oder Modell suchen…',
    No_Client_Text: 'Geben Sie zuerst einen Kunden ein oder stellen Sie ihn wieder her, um die Suche zu aktivieren.',
    Searching_Text: 'Suche läuft…',
    Select_Button: 'Auswählen',
    Confirm_Heading: 'Auswahl bestätigen',
    Confirm_Subtext: 'Bitte prüfen Sie Marke, Modell und Kennungen, bevor Sie fortfahren.',
    Search_Again_Button: 'Erneut suchen',
    Continue_Button: 'Ja – Weiter',
  },
  nl: {
    Heading: 'Vind uw product',
    Client_Input_Placeholder: 'Voer de clientKey in om door te gaan',
    Client_Load_Button: 'Laden',
    Scan_Button: 'Barcode scannen',
    Search_Placeholder: 'Zoek op merk of model…',
    No_Client_Text: 'Voer eerst een klant in of herstel deze om zoeken mogelijk te maken.',
    Searching_Text: 'Bezig met zoeken…',
    Select_Button: 'Selecteren',
    Confirm_Heading: 'Selectie bevestigen',
    Confirm_Subtext: 'Controleer merk, model en identificatiegegevens voordat u doorgaat.',
    Search_Again_Button: 'Opnieuw zoeken',
    Continue_Button: 'Ja – Doorgaan',
  },
  pt: {
    Heading: 'Encontre o seu produto',
    Client_Input_Placeholder: 'Introduza a clientKey para continuar',
    Client_Load_Button: 'Carregar',
    Scan_Button: 'Ler código de barras',
    Search_Placeholder: 'Pesquise por marca ou modelo…',
    No_Client_Text: 'Introduza ou recupere primeiro um cliente para ativar a pesquisa.',
    Searching_Text: 'A pesquisar…',
    Select_Button: 'Selecionar',
    Confirm_Heading: 'Confirmar seleção',
    Confirm_Subtext: 'Verifique a marca, o modelo e os identificadores antes de continuar.',
    Search_Again_Button: 'Pesquisar novamente',
    Continue_Button: 'Sim – Continuar',
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

  // 3. Save then publish values for every locale, default first
  const cmBase = '/content-manager/single-types/api::start-page.start-page';
  const ordered = [defaultLocale, ...locales.filter(l => l.code !== defaultLocale.code)];
  for (const locale of ordered) {
    const values = valuesForLocale(locale.code);
    const translated = values !== VALUES.en || String(locale.code).toLowerCase().startsWith('en');
    console.log(`\nWriting ${translated ? 'translated' : 'English fallback'} values to ${locale.code}…`);
    const saveRes = await request('PUT', `${cmBase}?locale=${locale.code}`, values, token);
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
