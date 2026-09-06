'use strict';

/**
 * Seed script: fills in the localized fields that the frontend asks for but
 * that were missing from the CMS, so those strings stop falling back to the
 * hard-coded English in the React code.
 *
 * It is additive and safe to re-run: for every locale it reads the current
 * entry, only writes keys that are currently empty, and leaves everything
 * already translated untouched. Pass --force to overwrite existing values.
 *
 * Regional locales (fr-BE, pt-BR, …) reuse their base language; locales with
 * no translation here fall back to English.
 *
 * Usage: node seed-missing-translations.js <adminEmail> <adminPassword> [--force] [--only=basket,lookup]
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').replace('--only=', '');
const positional = args.filter((a) => !a.startsWith('--'));
const EMAIL = positional[0];
const PASSWORD = positional[1];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed-missing-translations.js <adminEmail> <adminPassword> [--force] [--only=a,b]');
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

// Values keyed by single type, then by base language. Every single type here is
// a Strapi single type whose API id matches the key (api::<key>.<key>).
const CONTENT = {
  "basket": {
    "en": {
      "Continue": "Continue",
      "Loading_basket": "Loading basket",
      "Processing_checkout": "Processing checkout",
      "Missing_basket_id": "Provide a basket id in the URL, e.g. /basket?id=YOUR_BASKET_ID. If you recently added an item, try returning from the Offer page so we can restore your basket automatically.",
      "Image_placeholder": "Image",
      "Ref_label": "Ref:",
      "Item_fallback": "Item",
      "Months_suffix": "months",
      "Select_cover": "Select cover",
      "Skipped_items_note": "These items aren't included in your cover and are not part of the total.",
      "Promotion_label": "Promotion:",
      "Discount_label": "Discount:",
      "Mode_label": "Mode:",
      "Recaptcha_notice": "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
      "Empty_basket": "Your basket is empty."
    },
    "es": {
      "Continue": "Continuar",
      "Loading_basket": "Cargando la cesta",
      "Processing_checkout": "Procesando el pago",
      "Missing_basket_id": "Indica un id de cesta en la URL, por ejemplo /basket?id=TU_ID_DE_CESTA. Si acabas de añadir un artículo, vuelve desde la página de ofertas para que podamos restaurar tu cesta automáticamente.",
      "Image_placeholder": "Imagen",
      "Ref_label": "Ref.:",
      "Item_fallback": "Artículo",
      "Months_suffix": "meses",
      "Select_cover": "Elegir cobertura",
      "Skipped_items_note": "Estos artículos no están incluidos en tu cobertura y no forman parte del total.",
      "Promotion_label": "Promoción:",
      "Discount_label": "Descuento:",
      "Mode_label": "Modo:",
      "Recaptcha_notice": "Este sitio está protegido por reCAPTCHA y se aplican la Política de privacidad y las Condiciones del servicio de Google.",
      "Empty_basket": "Tu cesta está vacía."
    },
    "it": {
      "Continue": "Continua",
      "Loading_basket": "Caricamento del carrello",
      "Processing_checkout": "Pagamento in corso",
      "Missing_basket_id": "Indica un id carrello nell'URL, ad esempio /basket?id=IL_TUO_ID_CARRELLO. Se hai appena aggiunto un articolo, torna dalla pagina delle offerte così possiamo ripristinare il carrello automaticamente.",
      "Image_placeholder": "Immagine",
      "Ref_label": "Rif.:",
      "Item_fallback": "Articolo",
      "Months_suffix": "mesi",
      "Select_cover": "Scegli la copertura",
      "Skipped_items_note": "Questi articoli non sono inclusi nella copertura e non rientrano nel totale.",
      "Promotion_label": "Promozione:",
      "Discount_label": "Sconto:",
      "Mode_label": "Modalità:",
      "Recaptcha_notice": "Questo sito è protetto da reCAPTCHA e si applicano le Norme sulla privacy e i Termini di servizio di Google.",
      "Empty_basket": "Il tuo carrello è vuoto."
    },
    "fr": {
      "Continue": "Continuer",
      "Loading_basket": "Chargement du panier",
      "Processing_checkout": "Paiement en cours",
      "Missing_basket_id": "Indiquez un id de panier dans l'URL, par exemple /basket?id=VOTRE_ID_DE_PANIER. Si vous venez d'ajouter un article, revenez depuis la page des offres afin que nous puissions restaurer votre panier automatiquement.",
      "Image_placeholder": "Image",
      "Ref_label": "Réf. :",
      "Item_fallback": "Article",
      "Months_suffix": "mois",
      "Select_cover": "Choisir la couverture",
      "Skipped_items_note": "Ces articles ne sont pas inclus dans votre couverture et ne comptent pas dans le total.",
      "Promotion_label": "Promotion :",
      "Discount_label": "Remise :",
      "Mode_label": "Mode :",
      "Recaptcha_notice": "Ce site est protégé par reCAPTCHA ; les Règles de confidentialité et les Conditions d'utilisation de Google s'appliquent.",
      "Empty_basket": "Votre panier est vide."
    },
    "de": {
      "Continue": "Weiter",
      "Loading_basket": "Warenkorb wird geladen",
      "Processing_checkout": "Bezahlvorgang läuft",
      "Missing_basket_id": "Geben Sie eine Warenkorb-ID in der URL an, z. B. /basket?id=IHRE_WARENKORB_ID. Wenn Sie gerade einen Artikel hinzugefügt haben, kehren Sie über die Angebotsseite zurück, damit wir Ihren Warenkorb automatisch wiederherstellen können.",
      "Image_placeholder": "Bild",
      "Ref_label": "Ref.:",
      "Item_fallback": "Artikel",
      "Months_suffix": "Monate",
      "Select_cover": "Schutz auswählen",
      "Skipped_items_note": "Diese Artikel sind nicht im Schutz enthalten und zählen nicht zur Summe.",
      "Promotion_label": "Aktion:",
      "Discount_label": "Rabatt:",
      "Mode_label": "Modus:",
      "Recaptcha_notice": "Diese Website ist durch reCAPTCHA geschützt; es gelten die Datenschutzerklärung und die Nutzungsbedingungen von Google.",
      "Empty_basket": "Ihr Warenkorb ist leer."
    },
    "nl": {
      "Continue": "Doorgaan",
      "Loading_basket": "Winkelmandje laden",
      "Processing_checkout": "Afrekenen wordt verwerkt",
      "Missing_basket_id": "Geef een mandje-id op in de URL, bijvoorbeeld /basket?id=UW_MANDJE_ID. Als u zojuist een item hebt toegevoegd, ga dan terug via de aanbiedingenpagina zodat we uw mandje automatisch kunnen herstellen.",
      "Image_placeholder": "Afbeelding",
      "Ref_label": "Ref.:",
      "Item_fallback": "Item",
      "Months_suffix": "maanden",
      "Select_cover": "Dekking kiezen",
      "Skipped_items_note": "Deze items vallen niet onder uw dekking en tellen niet mee in het totaal.",
      "Promotion_label": "Actie:",
      "Discount_label": "Korting:",
      "Mode_label": "Modus:",
      "Recaptcha_notice": "Deze site wordt beschermd door reCAPTCHA; het privacybeleid en de servicevoorwaarden van Google zijn van toepassing.",
      "Empty_basket": "Uw winkelmandje is leeg."
    },
    "tr": {
      "Continue": "Devam et",
      "Loading_basket": "Sepet yükleniyor",
      "Processing_checkout": "Ödeme işleniyor",
      "Missing_basket_id": "URL'de bir sepet kimliği belirtin, örneğin /basket?id=SEPET_KIMLIGINIZ. Az önce bir ürün eklediyseniz, sepetinizi otomatik olarak geri yükleyebilmemiz için teklif sayfasından geri dönün.",
      "Image_placeholder": "Görsel",
      "Ref_label": "Ref.:",
      "Item_fallback": "Ürün",
      "Months_suffix": "ay",
      "Select_cover": "Teminat seç",
      "Skipped_items_note": "Bu ürünler teminatınıza dahil değildir ve toplama eklenmez.",
      "Promotion_label": "Promosyon:",
      "Discount_label": "İndirim:",
      "Mode_label": "Mod:",
      "Recaptcha_notice": "Bu site reCAPTCHA ile korunmaktadır; Google Gizlilik Politikası ve Hizmet Şartları geçerlidir.",
      "Empty_basket": "Sepetiniz boş."
    },
    "pt": {
      "Continue": "Continuar",
      "Loading_basket": "A carregar o cesto",
      "Processing_checkout": "A processar o pagamento",
      "Missing_basket_id": "Indique um id de cesto no URL, por exemplo /basket?id=O_SEU_ID_DE_CESTO. Se acabou de adicionar um artigo, regresse a partir da página de ofertas para podermos restaurar o seu cesto automaticamente.",
      "Image_placeholder": "Imagem",
      "Ref_label": "Ref.:",
      "Item_fallback": "Artigo",
      "Months_suffix": "meses",
      "Select_cover": "Escolher cobertura",
      "Skipped_items_note": "Estes artigos não estão incluídos na sua cobertura e não fazem parte do total.",
      "Promotion_label": "Promoção:",
      "Discount_label": "Desconto:",
      "Mode_label": "Modo:",
      "Recaptcha_notice": "Este site está protegido por reCAPTCHA e aplicam-se a Política de Privacidade e os Termos de Serviço da Google.",
      "Empty_basket": "O seu cesto está vazio."
    }
  },
  "display-offer": {
    "en": {
      "No_Offers_Heading": "No protection plans available",
      "No_Offers_Body": "No protection plans are available for this device right now. You can continue to checkout without cover, or go back to update your device details.",
      "No_Offers_Continue": "Continue without cover",
      "Working": "Updating…",
      "View_options": "View options",
      "Loading_offers": "Loading offers…",
      "Back_to_registration": "Back to registration",
      "Protection_plans": "Protection plans",
      "Cover_option": "Cover option",
      "Selected_plan": "Selected plan",
      "Choose_duration": "Choose your cover duration",
      "Select": "Select duration"
    },
    "es": {
      "No_Offers_Heading": "No hay planes de protección disponibles",
      "No_Offers_Body": "Ahora mismo no hay planes de protección disponibles para este dispositivo. Puedes continuar hasta el pago sin cobertura o volver atrás para actualizar los datos del dispositivo.",
      "No_Offers_Continue": "Continuar sin cobertura",
      "Working": "Actualizando…",
      "View_options": "Ver opciones",
      "Loading_offers": "Cargando ofertas…",
      "Back_to_registration": "Volver al registro",
      "Protection_plans": "Planes de protección",
      "Cover_option": "Opción de cobertura",
      "Selected_plan": "Plan seleccionado",
      "Choose_duration": "Elige la duración de tu cobertura",
      "Select": "Seleccionar duración"
    },
    "it": {
      "No_Offers_Heading": "Nessun piano di protezione disponibile",
      "No_Offers_Body": "Al momento non ci sono piani di protezione disponibili per questo dispositivo. Puoi procedere al pagamento senza copertura oppure tornare indietro per aggiornare i dati del dispositivo.",
      "No_Offers_Continue": "Continua senza copertura",
      "Working": "Aggiornamento…",
      "View_options": "Vedi le opzioni",
      "Loading_offers": "Caricamento delle offerte…",
      "Back_to_registration": "Torna alla registrazione",
      "Protection_plans": "Piani di protezione",
      "Cover_option": "Opzione di copertura",
      "Selected_plan": "Piano selezionato",
      "Choose_duration": "Scegli la durata della copertura",
      "Select": "Seleziona la durata"
    },
    "fr": {
      "No_Offers_Heading": "Aucune formule de protection disponible",
      "No_Offers_Body": "Aucune formule de protection n'est disponible pour cet appareil pour le moment. Vous pouvez continuer vers le paiement sans couverture ou revenir en arrière pour modifier les informations de l'appareil.",
      "No_Offers_Continue": "Continuer sans couverture",
      "Working": "Mise à jour…",
      "View_options": "Voir les options",
      "Loading_offers": "Chargement des offres…",
      "Back_to_registration": "Retour à l'enregistrement",
      "Protection_plans": "Formules de protection",
      "Cover_option": "Option de couverture",
      "Selected_plan": "Formule sélectionnée",
      "Choose_duration": "Choisissez la durée de votre couverture",
      "Select": "Choisir la durée"
    },
    "de": {
      "No_Offers_Heading": "Keine Schutzpakete verfügbar",
      "No_Offers_Body": "Für dieses Gerät sind derzeit keine Schutzpakete verfügbar. Sie können ohne Schutz zur Kasse gehen oder zurückgehen, um die Gerätedaten zu ändern.",
      "No_Offers_Continue": "Ohne Schutz fortfahren",
      "Working": "Wird aktualisiert…",
      "View_options": "Optionen ansehen",
      "Loading_offers": "Angebote werden geladen…",
      "Back_to_registration": "Zurück zur Registrierung",
      "Protection_plans": "Schutzpakete",
      "Cover_option": "Schutzoption",
      "Selected_plan": "Ausgewähltes Paket",
      "Choose_duration": "Wählen Sie die Laufzeit Ihres Schutzes",
      "Select": "Laufzeit wählen"
    },
    "nl": {
      "No_Offers_Heading": "Geen beschermingsplannen beschikbaar",
      "No_Offers_Body": "Er zijn op dit moment geen beschermingsplannen beschikbaar voor dit apparaat. U kunt zonder dekking doorgaan naar de kassa of teruggaan om de apparaatgegevens aan te passen.",
      "No_Offers_Continue": "Doorgaan zonder dekking",
      "Working": "Bijwerken…",
      "View_options": "Opties bekijken",
      "Loading_offers": "Aanbiedingen laden…",
      "Back_to_registration": "Terug naar registratie",
      "Protection_plans": "Beschermingsplannen",
      "Cover_option": "Dekkingsoptie",
      "Selected_plan": "Geselecteerd plan",
      "Choose_duration": "Kies de duur van uw dekking",
      "Select": "Duur selecteren"
    },
    "tr": {
      "No_Offers_Heading": "Uygun koruma planı yok",
      "No_Offers_Body": "Şu anda bu cihaz için uygun bir koruma planı bulunmuyor. Teminatsız olarak ödemeye devam edebilir veya geri dönüp cihaz bilgilerinizi güncelleyebilirsiniz.",
      "No_Offers_Continue": "Teminatsız devam et",
      "Working": "Güncelleniyor…",
      "View_options": "Seçenekleri gör",
      "Loading_offers": "Teklifler yükleniyor…",
      "Back_to_registration": "Kayda geri dön",
      "Protection_plans": "Koruma planları",
      "Cover_option": "Teminat seçeneği",
      "Selected_plan": "Seçilen plan",
      "Choose_duration": "Teminat sürenizi seçin",
      "Select": "Süre seç"
    },
    "pt": {
      "No_Offers_Heading": "Sem planos de proteção disponíveis",
      "No_Offers_Body": "De momento não há planos de proteção disponíveis para este dispositivo. Pode continuar para o pagamento sem cobertura ou voltar atrás para atualizar os dados do dispositivo.",
      "No_Offers_Continue": "Continuar sem cobertura",
      "Working": "A atualizar…",
      "View_options": "Ver opções",
      "Loading_offers": "A carregar as ofertas…",
      "Back_to_registration": "Voltar ao registo",
      "Protection_plans": "Planos de proteção",
      "Cover_option": "Opção de cobertura",
      "Selected_plan": "Plano selecionado",
      "Choose_duration": "Escolha a duração da sua cobertura",
      "Select": "Selecionar duração"
    }
  },
  "display-device": {
    "en": {
      "Months": "months",
      "No_Image": "No image",
      "Price_unavailable": "Price on request",
      "Product_Details": "Product details",
      "Promotion_Enable": "Enable promotion",
      "Promotion_Disable": "Disable promotion",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Please select the purchase date"
    },
    "es": {
      "Months": "meses",
      "No_Image": "Sin imagen",
      "Price_unavailable": "Precio bajo consulta",
      "Product_Details": "Detalles del producto",
      "Promotion_Enable": "Activar promoción",
      "Promotion_Disable": "Desactivar promoción",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Selecciona la fecha de compra"
    },
    "it": {
      "Months": "mesi",
      "No_Image": "Nessuna immagine",
      "Price_unavailable": "Prezzo su richiesta",
      "Product_Details": "Dettagli del prodotto",
      "Promotion_Enable": "Attiva la promozione",
      "Promotion_Disable": "Disattiva la promozione",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Seleziona la data di acquisto"
    },
    "fr": {
      "Months": "mois",
      "No_Image": "Aucune image",
      "Price_unavailable": "Prix sur demande",
      "Product_Details": "Détails du produit",
      "Promotion_Enable": "Activer la promotion",
      "Promotion_Disable": "Désactiver la promotion",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Veuillez sélectionner la date d'achat"
    },
    "de": {
      "Months": "Monate",
      "No_Image": "Kein Bild",
      "Price_unavailable": "Preis auf Anfrage",
      "Product_Details": "Produktdetails",
      "Promotion_Enable": "Aktion aktivieren",
      "Promotion_Disable": "Aktion deaktivieren",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Bitte wählen Sie das Kaufdatum"
    },
    "nl": {
      "Months": "maanden",
      "No_Image": "Geen afbeelding",
      "Price_unavailable": "Prijs op aanvraag",
      "Product_Details": "Productgegevens",
      "Promotion_Enable": "Actie inschakelen",
      "Promotion_Disable": "Actie uitschakelen",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Selecteer de aankoopdatum"
    },
    "tr": {
      "Months": "ay",
      "No_Image": "Görsel yok",
      "Price_unavailable": "Fiyat talep üzerine",
      "Product_Details": "Ürün ayrıntıları",
      "Promotion_Enable": "Promosyonu etkinleştir",
      "Promotion_Disable": "Promosyonu devre dışı bırak",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Lütfen satın alma tarihini seçin"
    },
    "pt": {
      "Months": "meses",
      "No_Image": "Sem imagem",
      "Price_unavailable": "Preço sob consulta",
      "Product_Details": "Detalhes do produto",
      "Promotion_Enable": "Ativar promoção",
      "Promotion_Disable": "Desativar promoção",
      "SKU": "SKU",
      "Select_purchase_date_prompt": "Selecione a data de compra"
    }
  },
  "portal-admin": {
    "en": {
      "Active_Users_Heading": "Active users",
      "Refresh_Button": "Refresh",
      "Edit_Button": "Edit",
      "Delete_User_Button": "Delete",
      "All_Locales_Label": "All supported locales",
      "Add_Pricing_Label": "Fetch pricing"
    },
    "es": {
      "Active_Users_Heading": "Usuarios activos",
      "Refresh_Button": "Actualizar",
      "Edit_Button": "Editar",
      "Delete_User_Button": "Eliminar",
      "All_Locales_Label": "Todas las configuraciones regionales admitidas",
      "Add_Pricing_Label": "Obtener precios"
    },
    "it": {
      "Active_Users_Heading": "Utenti attivi",
      "Refresh_Button": "Aggiorna",
      "Edit_Button": "Modifica",
      "Delete_User_Button": "Elimina",
      "All_Locales_Label": "Tutte le impostazioni locali supportate",
      "Add_Pricing_Label": "Recupera i prezzi"
    },
    "fr": {
      "Active_Users_Heading": "Utilisateurs actifs",
      "Refresh_Button": "Actualiser",
      "Edit_Button": "Modifier",
      "Delete_User_Button": "Supprimer",
      "All_Locales_Label": "Toutes les langues prises en charge",
      "Add_Pricing_Label": "Récupérer les tarifs"
    },
    "de": {
      "Active_Users_Heading": "Aktive Benutzer",
      "Refresh_Button": "Aktualisieren",
      "Edit_Button": "Bearbeiten",
      "Delete_User_Button": "Löschen",
      "All_Locales_Label": "Alle unterstützten Sprachen",
      "Add_Pricing_Label": "Preise abrufen"
    },
    "nl": {
      "Active_Users_Heading": "Actieve gebruikers",
      "Refresh_Button": "Vernieuwen",
      "Edit_Button": "Bewerken",
      "Delete_User_Button": "Verwijderen",
      "All_Locales_Label": "Alle ondersteunde locales",
      "Add_Pricing_Label": "Prijzen ophalen"
    },
    "tr": {
      "Active_Users_Heading": "Etkin kullanıcılar",
      "Refresh_Button": "Yenile",
      "Edit_Button": "Düzenle",
      "Delete_User_Button": "Sil",
      "All_Locales_Label": "Desteklenen tüm yerel ayarlar",
      "Add_Pricing_Label": "Fiyatları getir"
    },
    "pt": {
      "Active_Users_Heading": "Utilizadores ativos",
      "Refresh_Button": "Atualizar",
      "Edit_Button": "Editar",
      "Delete_User_Button": "Eliminar",
      "All_Locales_Label": "Todas as configurações regionais suportadas",
      "Add_Pricing_Label": "Obter preços"
    }
  },
  "start-page": {
    "en": {
      "Search_Label": "Enter make or model",
      "Search_Button": "Search",
      "Landing_Subtitle": "Scan a barcode or search by make and model to get started.",
      "Search_MakeModel_Label": "Search make/model",
      "Loading_Client": "Loading client configuration",
      "Item_Fallback": "Item",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Register your product",
      "Registration_Heading": "Register your product",
      "Registration_Subtitle": "Registering takes a couple of minutes. Start by finding your product — scan its barcode or search by make and model.",
      "Search_Prompt": "Which product are you registering?",
      "Clear_Search": "Clear search",
      "Steps_Heading": "How registration works",
      "Step_1_Title": "Find your product",
      "Step_1_Text": "Search by make and model, or scan the barcode on the product or its packaging.",
      "Step_2_Title": "Add your purchase details",
      "Step_2_Text": "Tell us when you bought it, what you paid and the serial number, if you have it.",
      "Step_3_Title": "Complete your registration",
      "Step_3_Text": "We save your product details, then show you any protection available for it.",
      "Benefits_Heading": "Why register your product",
      "Benefit_1_Title": "Your details in one place",
      "Benefit_1_Text": "Purchase date, price and serial number are kept together with your product.",
      "Benefit_2_Title": "Easier support",
      "Benefit_2_Text": "Having the details to hand makes warranty and service requests simpler.",
      "Benefit_3_Title": "Protection options",
      "Benefit_3_Text": "Once your product is registered you can see the protection available for it.",
      "Help_Heading": "Cannot find the product you want to register?",
      "Help_Text": "The barcode is usually on the back of the product or on its packaging. You can also search using the model number printed on the rating label.",
      "No_Results_Heading": "No matching products",
      "No_Results_Text": "Try the model number on its own, check the spelling, or scan the barcode instead."
    },
    "es": {
      "Search_Label": "Introduce la marca o el modelo",
      "Search_Button": "Buscar",
      "Landing_Subtitle": "Escanea un código de barras o busca por marca y modelo para empezar.",
      "Search_MakeModel_Label": "Buscar marca/modelo",
      "Loading_Client": "Cargando la configuración del cliente",
      "Item_Fallback": "Artículo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Registra tu producto",
      "Registration_Heading": "Registra tu producto",
      "Registration_Subtitle": "Registrarlo solo lleva un par de minutos. Empieza por encontrar tu producto: escanea su código de barras o busca por marca y modelo.",
      "Search_Prompt": "¿Qué producto vas a registrar?",
      "Clear_Search": "Borrar búsqueda",
      "Steps_Heading": "Cómo funciona el registro",
      "Step_1_Title": "Encuentra tu producto",
      "Step_1_Text": "Busca por marca y modelo o escanea el código de barras del producto o de su embalaje.",
      "Step_2_Title": "Añade los datos de compra",
      "Step_2_Text": "Indícanos cuándo lo compraste, cuánto pagaste y el número de serie, si lo tienes.",
      "Step_3_Title": "Completa el registro",
      "Step_3_Text": "Guardamos los datos de tu producto y después te mostramos la protección disponible para él.",
      "Benefits_Heading": "Por qué registrar tu producto",
      "Benefit_1_Title": "Tus datos en un solo lugar",
      "Benefit_1_Text": "La fecha de compra, el precio y el número de serie se guardan junto con tu producto.",
      "Benefit_2_Title": "Asistencia más sencilla",
      "Benefit_2_Text": "Tener los datos a mano facilita las solicitudes de garantía y de servicio técnico.",
      "Benefit_3_Title": "Opciones de protección",
      "Benefit_3_Text": "Una vez registrado tu producto, puedes ver la protección disponible para él.",
      "Help_Heading": "¿No encuentras el producto que quieres registrar?",
      "Help_Text": "El código de barras suele estar en la parte trasera del producto o en su embalaje. También puedes buscar con el número de modelo impreso en la etiqueta de características.",
      "No_Results_Heading": "No hay productos coincidentes",
      "No_Results_Text": "Prueba solo con el número de modelo, revisa la ortografía o escanea el código de barras."
    },
    "it": {
      "Search_Label": "Inserisci la marca o il modello",
      "Search_Button": "Cerca",
      "Landing_Subtitle": "Scansiona un codice a barre oppure cerca per marca e modello per iniziare.",
      "Search_MakeModel_Label": "Cerca marca/modello",
      "Loading_Client": "Caricamento della configurazione del cliente",
      "Item_Fallback": "Articolo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Registra il tuo prodotto",
      "Registration_Heading": "Registra il tuo prodotto",
      "Registration_Subtitle": "La registrazione richiede un paio di minuti. Inizia trovando il tuo prodotto: scansiona il codice a barre oppure cerca per marca e modello.",
      "Search_Prompt": "Quale prodotto vuoi registrare?",
      "Clear_Search": "Cancella la ricerca",
      "Steps_Heading": "Come funziona la registrazione",
      "Step_1_Title": "Trova il tuo prodotto",
      "Step_1_Text": "Cerca per marca e modello oppure scansiona il codice a barre sul prodotto o sulla confezione.",
      "Step_2_Title": "Aggiungi i dati di acquisto",
      "Step_2_Text": "Indicaci quando lo hai acquistato, quanto hai pagato e il numero di serie, se lo hai.",
      "Step_3_Title": "Completa la registrazione",
      "Step_3_Text": "Salviamo i dati del tuo prodotto e poi ti mostriamo la protezione disponibile.",
      "Benefits_Heading": "Perché registrare il tuo prodotto",
      "Benefit_1_Title": "I tuoi dati in un unico posto",
      "Benefit_1_Text": "Data di acquisto, prezzo e numero di serie restano insieme al tuo prodotto.",
      "Benefit_2_Title": "Assistenza più semplice",
      "Benefit_2_Text": "Avere i dati a portata di mano semplifica le richieste di garanzia e assistenza.",
      "Benefit_3_Title": "Opzioni di protezione",
      "Benefit_3_Text": "Una volta registrato il prodotto puoi vedere la protezione disponibile.",
      "Help_Heading": "Non trovi il prodotto da registrare?",
      "Help_Text": "Il codice a barre si trova di solito sul retro del prodotto o sulla confezione. Puoi anche cercare con il numero di modello stampato sull'etichetta dei dati tecnici.",
      "No_Results_Heading": "Nessun prodotto corrispondente",
      "No_Results_Text": "Prova solo con il numero di modello, controlla l'ortografia oppure scansiona il codice a barre."
    },
    "fr": {
      "Search_Label": "Saisissez la marque ou le modèle",
      "Search_Button": "Rechercher",
      "Landing_Subtitle": "Scannez un code-barres ou recherchez par marque et modèle pour commencer.",
      "Search_MakeModel_Label": "Rechercher marque/modèle",
      "Loading_Client": "Chargement de la configuration du client",
      "Item_Fallback": "Article",
      "SKU_Label": "SKU :",
      "GTIN_Label": "GTIN :",
      "Page_Title": "Enregistrez votre produit",
      "Registration_Heading": "Enregistrez votre produit",
      "Registration_Subtitle": "L'enregistrement prend deux minutes. Commencez par trouver votre produit : scannez son code-barres ou recherchez par marque et modèle.",
      "Search_Prompt": "Quel produit souhaitez-vous enregistrer ?",
      "Clear_Search": "Effacer la recherche",
      "Steps_Heading": "Comment se déroule l'enregistrement",
      "Step_1_Title": "Trouvez votre produit",
      "Step_1_Text": "Recherchez par marque et modèle ou scannez le code-barres du produit ou de son emballage.",
      "Step_2_Title": "Ajoutez vos informations d'achat",
      "Step_2_Text": "Indiquez la date d'achat, le prix payé et le numéro de série, si vous l'avez.",
      "Step_3_Title": "Finalisez votre enregistrement",
      "Step_3_Text": "Nous enregistrons les informations de votre produit, puis nous vous montrons les protections disponibles.",
      "Benefits_Heading": "Pourquoi enregistrer votre produit",
      "Benefit_1_Title": "Vos informations au même endroit",
      "Benefit_1_Text": "La date d'achat, le prix et le numéro de série sont conservés avec votre produit.",
      "Benefit_2_Title": "Une assistance facilitée",
      "Benefit_2_Text": "Avoir ces informations sous la main simplifie les demandes de garantie et de service.",
      "Benefit_3_Title": "Options de protection",
      "Benefit_3_Text": "Une fois votre produit enregistré, vous pouvez voir les protections disponibles.",
      "Help_Heading": "Vous ne trouvez pas le produit à enregistrer ?",
      "Help_Text": "Le code-barres se trouve généralement à l'arrière du produit ou sur son emballage. Vous pouvez aussi effectuer une recherche avec le numéro de modèle indiqué sur la plaque signalétique.",
      "No_Results_Heading": "Aucun produit correspondant",
      "No_Results_Text": "Essayez uniquement le numéro de modèle, vérifiez l'orthographe ou scannez le code-barres."
    },
    "de": {
      "Search_Label": "Marke oder Modell eingeben",
      "Search_Button": "Suchen",
      "Landing_Subtitle": "Scannen Sie einen Barcode oder suchen Sie nach Marke und Modell, um zu starten.",
      "Search_MakeModel_Label": "Marke/Modell suchen",
      "Loading_Client": "Kundenkonfiguration wird geladen",
      "Item_Fallback": "Artikel",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Registrieren Sie Ihr Produkt",
      "Registration_Heading": "Registrieren Sie Ihr Produkt",
      "Registration_Subtitle": "Die Registrierung dauert nur ein paar Minuten. Finden Sie zuerst Ihr Produkt: Scannen Sie den Barcode oder suchen Sie nach Marke und Modell.",
      "Search_Prompt": "Welches Produkt möchten Sie registrieren?",
      "Clear_Search": "Suche löschen",
      "Steps_Heading": "So funktioniert die Registrierung",
      "Step_1_Title": "Finden Sie Ihr Produkt",
      "Step_1_Text": "Suchen Sie nach Marke und Modell oder scannen Sie den Barcode auf dem Produkt oder der Verpackung.",
      "Step_2_Title": "Kaufdaten hinzufügen",
      "Step_2_Text": "Sagen Sie uns, wann Sie es gekauft haben, was Sie bezahlt haben und die Seriennummer, sofern vorhanden.",
      "Step_3_Title": "Registrierung abschließen",
      "Step_3_Text": "Wir speichern Ihre Produktdaten und zeigen Ihnen anschließend den verfügbaren Schutz.",
      "Benefits_Heading": "Warum Sie Ihr Produkt registrieren sollten",
      "Benefit_1_Title": "Ihre Daten an einem Ort",
      "Benefit_1_Text": "Kaufdatum, Preis und Seriennummer werden zusammen mit Ihrem Produkt gespeichert.",
      "Benefit_2_Title": "Einfacherer Support",
      "Benefit_2_Text": "Wenn die Daten vorliegen, sind Garantie- und Serviceanfragen einfacher.",
      "Benefit_3_Title": "Schutzoptionen",
      "Benefit_3_Text": "Sobald Ihr Produkt registriert ist, sehen Sie den dafür verfügbaren Schutz.",
      "Help_Heading": "Sie finden das Produkt nicht, das Sie registrieren möchten?",
      "Help_Text": "Der Barcode befindet sich meist auf der Rückseite des Produkts oder auf der Verpackung. Sie können auch mit der Modellnummer vom Typenschild suchen.",
      "No_Results_Heading": "Keine passenden Produkte",
      "No_Results_Text": "Versuchen Sie es nur mit der Modellnummer, prüfen Sie die Schreibweise oder scannen Sie stattdessen den Barcode."
    },
    "nl": {
      "Search_Label": "Voer merk of model in",
      "Search_Button": "Zoeken",
      "Landing_Subtitle": "Scan een barcode of zoek op merk en model om te beginnen.",
      "Search_MakeModel_Label": "Zoek merk/model",
      "Loading_Client": "Klantconfiguratie laden",
      "Item_Fallback": "Item",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Registreer uw product",
      "Registration_Heading": "Registreer uw product",
      "Registration_Subtitle": "Registreren duurt een paar minuten. Zoek eerst uw product: scan de barcode of zoek op merk en model.",
      "Search_Prompt": "Welk product wilt u registreren?",
      "Clear_Search": "Zoekopdracht wissen",
      "Steps_Heading": "Zo werkt registreren",
      "Step_1_Title": "Vind uw product",
      "Step_1_Text": "Zoek op merk en model of scan de barcode op het product of de verpakking.",
      "Step_2_Title": "Voeg uw aankoopgegevens toe",
      "Step_2_Text": "Vertel ons wanneer u het hebt gekocht, wat u hebt betaald en het serienummer, als u dat hebt.",
      "Step_3_Title": "Rond uw registratie af",
      "Step_3_Text": "Wij bewaren uw productgegevens en tonen daarna de beschikbare bescherming.",
      "Benefits_Heading": "Waarom uw product registreren",
      "Benefit_1_Title": "Uw gegevens op één plek",
      "Benefit_1_Text": "Aankoopdatum, prijs en serienummer worden samen met uw product bewaard.",
      "Benefit_2_Title": "Eenvoudiger ondersteuning",
      "Benefit_2_Text": "Met de gegevens bij de hand zijn garantie- en serviceaanvragen eenvoudiger.",
      "Benefit_3_Title": "Beschermingsopties",
      "Benefit_3_Text": "Zodra uw product is geregistreerd, ziet u welke bescherming beschikbaar is.",
      "Help_Heading": "Kunt u het product dat u wilt registreren niet vinden?",
      "Help_Text": "De barcode staat meestal op de achterkant van het product of op de verpakking. U kunt ook zoeken met het modelnummer op het typeplaatje.",
      "No_Results_Heading": "Geen overeenkomende producten",
      "No_Results_Text": "Probeer alleen het modelnummer, controleer de spelling of scan de barcode."
    },
    "tr": {
      "Search_Label": "Marka veya model girin",
      "Search_Button": "Ara",
      "Landing_Subtitle": "Başlamak için bir barkod tarayın ya da marka ve modele göre arayın.",
      "Search_MakeModel_Label": "Marka/model ara",
      "Loading_Client": "Müşteri yapılandırması yükleniyor",
      "Item_Fallback": "Ürün",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Ürününüzü kaydedin",
      "Registration_Heading": "Ürününüzü kaydedin",
      "Registration_Subtitle": "Kayıt birkaç dakika sürer. Önce ürününüzü bulun: barkodunu tarayın ya da marka ve modele göre arayın.",
      "Search_Prompt": "Hangi ürünü kaydediyorsunuz?",
      "Clear_Search": "Aramayı temizle",
      "Steps_Heading": "Kayıt nasıl işler",
      "Step_1_Title": "Ürününüzü bulun",
      "Step_1_Text": "Marka ve modele göre arayın ya da ürünün veya ambalajının üzerindeki barkodu tarayın.",
      "Step_2_Title": "Satın alma bilgilerinizi ekleyin",
      "Step_2_Text": "Ürünü ne zaman aldığınızı, ne kadar ödediğinizi ve varsa seri numarasını bize bildirin.",
      "Step_3_Title": "Kaydınızı tamamlayın",
      "Step_3_Text": "Ürün bilgilerinizi kaydeder, ardından ürününüz için sunulan korumayı gösteririz.",
      "Benefits_Heading": "Ürününüzü neden kaydetmelisiniz",
      "Benefit_1_Title": "Bilgileriniz tek yerde",
      "Benefit_1_Text": "Satın alma tarihi, fiyat ve seri numarası ürününüzle birlikte saklanır.",
      "Benefit_2_Title": "Daha kolay destek",
      "Benefit_2_Text": "Bilgiler elinizin altında olduğunda garanti ve servis talepleri daha kolaydır.",
      "Benefit_3_Title": "Koruma seçenekleri",
      "Benefit_3_Text": "Ürününüz kaydedildikten sonra sunulan korumayı görebilirsiniz.",
      "Help_Heading": "Kaydetmek istediğiniz ürünü bulamıyor musunuz?",
      "Help_Text": "Barkod genellikle ürünün arkasında veya ambalajında bulunur. Ayrıca bilgi etiketindeki model numarasıyla da arama yapabilirsiniz.",
      "No_Results_Heading": "Eşleşen ürün yok",
      "No_Results_Text": "Yalnızca model numarasını deneyin, yazımı kontrol edin veya bunun yerine barkodu tarayın."
    },
    "pt": {
      "Search_Label": "Introduza a marca ou o modelo",
      "Search_Button": "Pesquisar",
      "Landing_Subtitle": "Leia um código de barras ou pesquise por marca e modelo para começar.",
      "Search_MakeModel_Label": "Pesquisar marca/modelo",
      "Loading_Client": "A carregar a configuração do cliente",
      "Item_Fallback": "Artigo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Page_Title": "Registe o seu produto",
      "Registration_Heading": "Registe o seu produto",
      "Registration_Subtitle": "O registo demora dois minutos. Comece por encontrar o seu produto: leia o código de barras ou pesquise por marca e modelo.",
      "Search_Prompt": "Que produto quer registar?",
      "Clear_Search": "Limpar pesquisa",
      "Steps_Heading": "Como funciona o registo",
      "Step_1_Title": "Encontre o seu produto",
      "Step_1_Text": "Pesquise por marca e modelo ou leia o código de barras do produto ou da embalagem.",
      "Step_2_Title": "Adicione os dados da compra",
      "Step_2_Text": "Diga-nos quando o comprou, quanto pagou e o número de série, se o tiver.",
      "Step_3_Title": "Conclua o registo",
      "Step_3_Text": "Guardamos os dados do seu produto e mostramos-lhe depois a proteção disponível.",
      "Benefits_Heading": "Porquê registar o seu produto",
      "Benefit_1_Title": "Os seus dados num só lugar",
      "Benefit_1_Text": "A data de compra, o preço e o número de série ficam junto do seu produto.",
      "Benefit_2_Title": "Apoio mais simples",
      "Benefit_2_Text": "Ter os dados à mão simplifica os pedidos de garantia e de assistência.",
      "Benefit_3_Title": "Opções de proteção",
      "Benefit_3_Text": "Depois de registar o produto pode ver a proteção disponível para ele.",
      "Help_Heading": "Não encontra o produto que quer registar?",
      "Help_Text": "O código de barras está normalmente na parte de trás do produto ou na embalagem. Também pode pesquisar com o número de modelo impresso na chapa de características.",
      "No_Results_Heading": "Sem produtos correspondentes",
      "No_Results_Text": "Experimente apenas o número de modelo, verifique a ortografia ou leia o código de barras."
    }
  },
  "lookup": {
    "en": {
      "Page_Title": "Product lookup",
      "Loading_Branding": "Loading client branding",
      "Client_Input_Placeholder": "Enter clientKey to continue",
      "Client_Load_Button": "Load",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Type SKU (2+ chars)…",
      "Placeholder_GTIN": "Enter GTIN (6+ digits) or scan…",
      "Placeholder_Model": "Type make or model (2+ chars)…",
      "No_Client_Text": "Enter or recover a client first to enable quick search.",
      "Searching_Text": "Searching…",
      "Item_Fallback": "Item",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Category:",
      "Select_Button": "Select",
      "Confirm_Heading": "Confirm selection",
      "Confirm_Subtext": "Please check make, model and identifiers before continuing.",
      "Search_Again_Button": "Search again",
      "Continue_Button": "Yes — Continue"
    },
    "es": {
      "Page_Title": "Búsqueda de productos",
      "Loading_Branding": "Cargando la marca del cliente",
      "Client_Input_Placeholder": "Introduce la clientKey para continuar",
      "Client_Load_Button": "Cargar",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Escribe el SKU (2 caracteres o más)…",
      "Placeholder_GTIN": "Introduce el GTIN (6 dígitos o más) o escanea…",
      "Placeholder_Model": "Escribe la marca o el modelo (2 caracteres o más)…",
      "No_Client_Text": "Introduce o recupera primero un cliente para activar la búsqueda rápida.",
      "Searching_Text": "Buscando…",
      "Item_Fallback": "Artículo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Categoría:",
      "Select_Button": "Seleccionar",
      "Confirm_Heading": "Confirmar selección",
      "Confirm_Subtext": "Comprueba la marca, el modelo y los identificadores antes de continuar.",
      "Search_Again_Button": "Buscar de nuevo",
      "Continue_Button": "Sí – Continuar"
    },
    "it": {
      "Page_Title": "Ricerca prodotto",
      "Loading_Branding": "Caricamento del branding del cliente",
      "Client_Input_Placeholder": "Inserisci la clientKey per continuare",
      "Client_Load_Button": "Carica",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Digita lo SKU (almeno 2 caratteri)…",
      "Placeholder_GTIN": "Inserisci il GTIN (almeno 6 cifre) o scansiona…",
      "Placeholder_Model": "Digita marca o modello (almeno 2 caratteri)…",
      "No_Client_Text": "Inserisci o recupera prima un cliente per abilitare la ricerca rapida.",
      "Searching_Text": "Ricerca in corso…",
      "Item_Fallback": "Articolo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Categoria:",
      "Select_Button": "Seleziona",
      "Confirm_Heading": "Conferma la selezione",
      "Confirm_Subtext": "Controlla marca, modello e identificativi prima di continuare.",
      "Search_Again_Button": "Cerca di nuovo",
      "Continue_Button": "Sì – Continua"
    },
    "fr": {
      "Page_Title": "Recherche de produit",
      "Loading_Branding": "Chargement de l'identité visuelle du client",
      "Client_Input_Placeholder": "Saisissez la clientKey pour continuer",
      "Client_Load_Button": "Charger",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Saisissez le SKU (2 caractères minimum)…",
      "Placeholder_GTIN": "Saisissez le GTIN (6 chiffres minimum) ou scannez…",
      "Placeholder_Model": "Saisissez la marque ou le modèle (2 caractères minimum)…",
      "No_Client_Text": "Saisissez ou récupérez d'abord un client pour activer la recherche rapide.",
      "Searching_Text": "Recherche en cours…",
      "Item_Fallback": "Article",
      "SKU_Label": "SKU :",
      "GTIN_Label": "GTIN :",
      "Category_Label": "Catégorie :",
      "Select_Button": "Sélectionner",
      "Confirm_Heading": "Confirmer la sélection",
      "Confirm_Subtext": "Vérifiez la marque, le modèle et les identifiants avant de continuer.",
      "Search_Again_Button": "Nouvelle recherche",
      "Continue_Button": "Oui – Continuer"
    },
    "de": {
      "Page_Title": "Produktsuche",
      "Loading_Branding": "Kunden-Branding wird geladen",
      "Client_Input_Placeholder": "clientKey eingeben, um fortzufahren",
      "Client_Load_Button": "Laden",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "SKU eingeben (mind. 2 Zeichen)…",
      "Placeholder_GTIN": "GTIN eingeben (mind. 6 Ziffern) oder scannen…",
      "Placeholder_Model": "Marke oder Modell eingeben (mind. 2 Zeichen)…",
      "No_Client_Text": "Geben Sie zuerst einen Kunden ein oder stellen Sie ihn wieder her, um die Schnellsuche zu aktivieren.",
      "Searching_Text": "Suche läuft…",
      "Item_Fallback": "Artikel",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Kategorie:",
      "Select_Button": "Auswählen",
      "Confirm_Heading": "Auswahl bestätigen",
      "Confirm_Subtext": "Bitte prüfen Sie Marke, Modell und Kennungen, bevor Sie fortfahren.",
      "Search_Again_Button": "Erneut suchen",
      "Continue_Button": "Ja – Weiter"
    },
    "nl": {
      "Page_Title": "Product opzoeken",
      "Loading_Branding": "Klantbranding laden",
      "Client_Input_Placeholder": "Voer de clientKey in om door te gaan",
      "Client_Load_Button": "Laden",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Typ de SKU (minimaal 2 tekens)…",
      "Placeholder_GTIN": "Voer de GTIN in (minimaal 6 cijfers) of scan…",
      "Placeholder_Model": "Typ merk of model (minimaal 2 tekens)…",
      "No_Client_Text": "Voer eerst een klant in of herstel deze om snelzoeken mogelijk te maken.",
      "Searching_Text": "Bezig met zoeken…",
      "Item_Fallback": "Item",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Categorie:",
      "Select_Button": "Selecteren",
      "Confirm_Heading": "Selectie bevestigen",
      "Confirm_Subtext": "Controleer merk, model en identificatiegegevens voordat u doorgaat.",
      "Search_Again_Button": "Opnieuw zoeken",
      "Continue_Button": "Ja – Doorgaan"
    },
    "tr": {
      "Page_Title": "Ürün arama",
      "Loading_Branding": "Müşteri markası yükleniyor",
      "Client_Input_Placeholder": "Devam etmek için clientKey girin",
      "Client_Load_Button": "Yükle",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "SKU yazın (en az 2 karakter)…",
      "Placeholder_GTIN": "GTIN girin (en az 6 rakam) veya tarayın…",
      "Placeholder_Model": "Marka veya model yazın (en az 2 karakter)…",
      "No_Client_Text": "Hızlı aramayı etkinleştirmek için önce bir müşteri girin veya kurtarın.",
      "Searching_Text": "Aranıyor…",
      "Item_Fallback": "Ürün",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Kategori:",
      "Select_Button": "Seç",
      "Confirm_Heading": "Seçimi onayla",
      "Confirm_Subtext": "Devam etmeden önce lütfen marka, model ve tanımlayıcıları kontrol edin.",
      "Search_Again_Button": "Tekrar ara",
      "Continue_Button": "Evet – Devam et"
    },
    "pt": {
      "Page_Title": "Pesquisa de produto",
      "Loading_Branding": "A carregar a identidade do cliente",
      "Client_Input_Placeholder": "Introduza a clientKey para continuar",
      "Client_Load_Button": "Carregar",
      "SKU_Tab": "SKU",
      "GTIN_Tab": "GTIN",
      "Placeholder_SKU": "Escreva o SKU (2 ou mais caracteres)…",
      "Placeholder_GTIN": "Introduza o GTIN (6 ou mais dígitos) ou leia…",
      "Placeholder_Model": "Escreva a marca ou o modelo (2 ou mais caracteres)…",
      "No_Client_Text": "Introduza ou recupere primeiro um cliente para ativar a pesquisa rápida.",
      "Searching_Text": "A pesquisar…",
      "Item_Fallback": "Artigo",
      "SKU_Label": "SKU:",
      "GTIN_Label": "GTIN:",
      "Category_Label": "Categoria:",
      "Select_Button": "Selecionar",
      "Confirm_Heading": "Confirmar seleção",
      "Confirm_Subtext": "Verifique a marca, o modelo e os identificadores antes de continuar.",
      "Search_Again_Button": "Pesquisar novamente",
      "Continue_Button": "Sim – Continuar"
    }
  },
  "customer-hub": {
    "en": {
      "Page_Title": "Customer hub",
      "Loading_Customer": "Loading customer data…",
      "Identify_Customer_Heading": "Identify customer",
      "Error_Prefix": "Error:",
      "Client_Logo_Alt": "Client logo",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "Unnamed",
      "ID_Label": "ID:",
      "No_Address": "No address on file",
      "No_Contracts": "No contracts",
      "No_Devices": "No devices",
      "Basket": "Basket:",
      "View_Details": "View details",
      "Open": "Open",
      "Close": "Close",
      "Device_Fallback": "Device",
      "Identifiers": "Identifiers",
      "Make": "Make:",
      "Model": "Model:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Category:",
      "Registration": "Registration",
      "Purchase_Date": "Purchase date:",
      "Price": "Price:",
      "Client_Ref": "Client ref:",
      "Identifiers_Full": "Identifiers (full)",
      "Client": "Client:",
      "Locale_Label": "Locale:",
      "Source": "Source:",
      "Registered_At": "Registered at:",
      "Verify_phone_header": "Verify your phone",
      "Contact": "Contact",
      "Email": "Email:",
      "Phone": "Phone:",
      "Address": "Address",
      "Contracts": "Contracts",
      "Type": "Type:",
      "Status": "Status:",
      "Devices": "Devices"
    },
    "es": {
      "Page_Title": "Área del cliente",
      "Loading_Customer": "Cargando los datos del cliente…",
      "Identify_Customer_Heading": "Identificar al cliente",
      "Error_Prefix": "Error:",
      "Client_Logo_Alt": "Logotipo del cliente",
      "Logo_Placeholder": "Logotipo",
      "Unnamed_Customer": "Sin nombre",
      "ID_Label": "ID:",
      "No_Address": "No hay ninguna dirección registrada",
      "No_Contracts": "Sin contratos",
      "No_Devices": "Sin dispositivos",
      "Basket": "Cesta:",
      "View_Details": "Ver detalles",
      "Open": "Abrir",
      "Close": "Cerrar",
      "Device_Fallback": "Dispositivo",
      "Identifiers": "Identificadores",
      "Make": "Marca:",
      "Model": "Modelo:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Categoría:",
      "Registration": "Registro",
      "Purchase_Date": "Fecha de compra:",
      "Price": "Precio:",
      "Client_Ref": "Ref. del cliente:",
      "Identifiers_Full": "Identificadores (completos)",
      "Client": "Cliente:",
      "Locale_Label": "Configuración regional:",
      "Source": "Origen:",
      "Registered_At": "Registrado el:",
      "Verify_phone_header": "Verifica tu teléfono",
      "Contact": "Contacto",
      "Email": "Correo electrónico:",
      "Phone": "Teléfono:",
      "Address": "Dirección",
      "Contracts": "Contratos",
      "Type": "Tipo:",
      "Status": "Estado:",
      "Devices": "Dispositivos"
    },
    "it": {
      "Page_Title": "Area cliente",
      "Loading_Customer": "Caricamento dei dati del cliente…",
      "Identify_Customer_Heading": "Identifica il cliente",
      "Error_Prefix": "Errore:",
      "Client_Logo_Alt": "Logo del cliente",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "Senza nome",
      "ID_Label": "ID:",
      "No_Address": "Nessun indirizzo registrato",
      "No_Contracts": "Nessun contratto",
      "No_Devices": "Nessun dispositivo",
      "Basket": "Carrello:",
      "View_Details": "Vedi i dettagli",
      "Open": "Apri",
      "Close": "Chiudi",
      "Device_Fallback": "Dispositivo",
      "Identifiers": "Identificativi",
      "Make": "Marca:",
      "Model": "Modello:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Categoria:",
      "Registration": "Registrazione",
      "Purchase_Date": "Data di acquisto:",
      "Price": "Prezzo:",
      "Client_Ref": "Rif. cliente:",
      "Identifiers_Full": "Identificativi (completi)",
      "Client": "Cliente:",
      "Locale_Label": "Impostazione locale:",
      "Source": "Origine:",
      "Registered_At": "Registrato il:",
      "Verify_phone_header": "Verifica il tuo telefono",
      "Contact": "Contatti",
      "Email": "E-mail:",
      "Phone": "Telefono:",
      "Address": "Indirizzo",
      "Contracts": "Contratti",
      "Type": "Tipo:",
      "Status": "Stato:",
      "Devices": "Dispositivi"
    },
    "fr": {
      "Page_Title": "Espace client",
      "Loading_Customer": "Chargement des données client…",
      "Identify_Customer_Heading": "Identifier le client",
      "Error_Prefix": "Erreur :",
      "Client_Logo_Alt": "Logo du client",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "Sans nom",
      "ID_Label": "ID :",
      "No_Address": "Aucune adresse enregistrée",
      "No_Contracts": "Aucun contrat",
      "No_Devices": "Aucun appareil",
      "Basket": "Panier :",
      "View_Details": "Voir les détails",
      "Open": "Ouvrir",
      "Close": "Fermer",
      "Device_Fallback": "Appareil",
      "Identifiers": "Identifiants",
      "Make": "Marque :",
      "Model": "Modèle :",
      "GTIN_SKU": "GTIN / SKU :",
      "Category": "Catégorie :",
      "Registration": "Enregistrement",
      "Purchase_Date": "Date d'achat :",
      "Price": "Prix :",
      "Client_Ref": "Réf. client :",
      "Identifiers_Full": "Identifiants (complets)",
      "Client": "Client :",
      "Locale_Label": "Langue :",
      "Source": "Source :",
      "Registered_At": "Enregistré le :",
      "Verify_phone_header": "Vérifiez votre téléphone",
      "Contact": "Contact",
      "Email": "E-mail :",
      "Phone": "Téléphone :",
      "Address": "Adresse",
      "Contracts": "Contrats",
      "Type": "Type :",
      "Status": "Statut :",
      "Devices": "Appareils"
    },
    "de": {
      "Page_Title": "Kundenbereich",
      "Loading_Customer": "Kundendaten werden geladen…",
      "Identify_Customer_Heading": "Kunden identifizieren",
      "Error_Prefix": "Fehler:",
      "Client_Logo_Alt": "Kundenlogo",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "Ohne Namen",
      "ID_Label": "ID:",
      "No_Address": "Keine Adresse hinterlegt",
      "No_Contracts": "Keine Verträge",
      "No_Devices": "Keine Geräte",
      "Basket": "Warenkorb:",
      "View_Details": "Details ansehen",
      "Open": "Öffnen",
      "Close": "Schließen",
      "Device_Fallback": "Gerät",
      "Identifiers": "Kennungen",
      "Make": "Marke:",
      "Model": "Modell:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Kategorie:",
      "Registration": "Registrierung",
      "Purchase_Date": "Kaufdatum:",
      "Price": "Preis:",
      "Client_Ref": "Kundenreferenz:",
      "Identifiers_Full": "Kennungen (vollständig)",
      "Client": "Kunde:",
      "Locale_Label": "Sprache:",
      "Source": "Quelle:",
      "Registered_At": "Registriert am:",
      "Verify_phone_header": "Telefonnummer bestätigen",
      "Contact": "Kontakt",
      "Email": "E-Mail:",
      "Phone": "Telefon:",
      "Address": "Adresse",
      "Contracts": "Verträge",
      "Type": "Typ:",
      "Status": "Status:",
      "Devices": "Geräte"
    },
    "nl": {
      "Page_Title": "Klantenhub",
      "Loading_Customer": "Klantgegevens laden…",
      "Identify_Customer_Heading": "Klant identificeren",
      "Error_Prefix": "Fout:",
      "Client_Logo_Alt": "Logo van de klant",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "Naamloos",
      "ID_Label": "ID:",
      "No_Address": "Geen adres geregistreerd",
      "No_Contracts": "Geen contracten",
      "No_Devices": "Geen apparaten",
      "Basket": "Mandje:",
      "View_Details": "Details bekijken",
      "Open": "Openen",
      "Close": "Sluiten",
      "Device_Fallback": "Apparaat",
      "Identifiers": "Identificatiegegevens",
      "Make": "Merk:",
      "Model": "Model:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Categorie:",
      "Registration": "Registratie",
      "Purchase_Date": "Aankoopdatum:",
      "Price": "Prijs:",
      "Client_Ref": "Klantreferentie:",
      "Identifiers_Full": "Identificatiegegevens (volledig)",
      "Client": "Klant:",
      "Locale_Label": "Locale:",
      "Source": "Bron:",
      "Registered_At": "Geregistreerd op:",
      "Verify_phone_header": "Verifieer uw telefoon",
      "Contact": "Contact",
      "Email": "E-mail:",
      "Phone": "Telefoon:",
      "Address": "Adres",
      "Contracts": "Contracten",
      "Type": "Type:",
      "Status": "Status:",
      "Devices": "Apparaten"
    },
    "tr": {
      "Page_Title": "Müşteri merkezi",
      "Loading_Customer": "Müşteri verileri yükleniyor…",
      "Identify_Customer_Heading": "Müşteriyi tanımla",
      "Error_Prefix": "Hata:",
      "Client_Logo_Alt": "Müşteri logosu",
      "Logo_Placeholder": "Logo",
      "Unnamed_Customer": "İsimsiz",
      "ID_Label": "Kimlik:",
      "No_Address": "Kayıtlı adres yok",
      "No_Contracts": "Sözleşme yok",
      "No_Devices": "Cihaz yok",
      "Basket": "Sepet:",
      "View_Details": "Ayrıntıları gör",
      "Open": "Aç",
      "Close": "Kapat",
      "Device_Fallback": "Cihaz",
      "Identifiers": "Tanımlayıcılar",
      "Make": "Marka:",
      "Model": "Model:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Kategori:",
      "Registration": "Kayıt",
      "Purchase_Date": "Satın alma tarihi:",
      "Price": "Fiyat:",
      "Client_Ref": "Müşteri referansı:",
      "Identifiers_Full": "Tanımlayıcılar (tam)",
      "Client": "Müşteri:",
      "Locale_Label": "Yerel ayar:",
      "Source": "Kaynak:",
      "Registered_At": "Kayıt tarihi:",
      "Verify_phone_header": "Telefonunuzu doğrulayın",
      "Contact": "İletişim",
      "Email": "E-posta:",
      "Phone": "Telefon:",
      "Address": "Adres",
      "Contracts": "Sözleşmeler",
      "Type": "Tür:",
      "Status": "Durum:",
      "Devices": "Cihazlar"
    },
    "pt": {
      "Page_Title": "Área do cliente",
      "Loading_Customer": "A carregar os dados do cliente…",
      "Identify_Customer_Heading": "Identificar o cliente",
      "Error_Prefix": "Erro:",
      "Client_Logo_Alt": "Logótipo do cliente",
      "Logo_Placeholder": "Logótipo",
      "Unnamed_Customer": "Sem nome",
      "ID_Label": "ID:",
      "No_Address": "Sem morada registada",
      "No_Contracts": "Sem contratos",
      "No_Devices": "Sem dispositivos",
      "Basket": "Cesto:",
      "View_Details": "Ver detalhes",
      "Open": "Abrir",
      "Close": "Fechar",
      "Device_Fallback": "Dispositivo",
      "Identifiers": "Identificadores",
      "Make": "Marca:",
      "Model": "Modelo:",
      "GTIN_SKU": "GTIN / SKU:",
      "Category": "Categoria:",
      "Registration": "Registo",
      "Purchase_Date": "Data de compra:",
      "Price": "Preço:",
      "Client_Ref": "Ref. do cliente:",
      "Identifiers_Full": "Identificadores (completos)",
      "Client": "Cliente:",
      "Locale_Label": "Configuração regional:",
      "Source": "Origem:",
      "Registered_At": "Registado em:",
      "Verify_phone_header": "Verifique o seu telefone",
      "Contact": "Contacto",
      "Email": "E-mail:",
      "Phone": "Telefone:",
      "Address": "Morada",
      "Contracts": "Contratos",
      "Type": "Tipo:",
      "Status": "Estado:",
      "Devices": "Dispositivos"
    }
  },
  "checkout-success": {
    "en": {
      "Page_Title": "Order confirmed",
      "Payment_Confirmed_Badge": "Payment confirmed",
      "Thank_You_Heading": "Thank you — your cover is now active.",
      "Thank_You_Subtext": "Keep this page for your records. We've emailed a receipt if an address was provided.",
      "Total_Paid_Label": "Total paid",
      "Ref_Label": "Ref:",
      "No_Basket_Reference": "We could not find a basket reference for this confirmation.",
      "Loading_Details": "Loading your confirmation details…",
      "Covered_Products_Heading": "Covered products",
      "Basket_Id_Label": "Basket ID:",
      "Total_Label": "Total",
      "Item_Fallback": "Item",
      "Need_Help_Heading": "Need help?",
      "Need_Help_Body": "Keep your reference handy and contact support if you have any questions about your cover.",
      "Home_Button": "Home"
    },
    "es": {
      "Page_Title": "Pedido confirmado",
      "Payment_Confirmed_Badge": "Pago confirmado",
      "Thank_You_Heading": "Gracias: tu cobertura ya está activa.",
      "Thank_You_Subtext": "Guarda esta página para tus registros. Te hemos enviado un recibo por correo si facilitaste una dirección.",
      "Total_Paid_Label": "Total pagado",
      "Ref_Label": "Ref.:",
      "No_Basket_Reference": "No hemos encontrado ninguna referencia de cesta para esta confirmación.",
      "Loading_Details": "Cargando los datos de tu confirmación…",
      "Covered_Products_Heading": "Productos cubiertos",
      "Basket_Id_Label": "ID de cesta:",
      "Total_Label": "Total",
      "Item_Fallback": "Artículo",
      "Need_Help_Heading": "¿Necesitas ayuda?",
      "Need_Help_Body": "Ten tu referencia a mano y ponte en contacto con soporte si tienes alguna duda sobre tu cobertura.",
      "Home_Button": "Inicio"
    },
    "it": {
      "Page_Title": "Ordine confermato",
      "Payment_Confirmed_Badge": "Pagamento confermato",
      "Thank_You_Heading": "Grazie: la tua copertura è ora attiva.",
      "Thank_You_Subtext": "Conserva questa pagina per i tuoi archivi. Se hai fornito un indirizzo, ti abbiamo inviato una ricevuta via e-mail.",
      "Total_Paid_Label": "Totale pagato",
      "Ref_Label": "Rif.:",
      "No_Basket_Reference": "Non abbiamo trovato alcun riferimento del carrello per questa conferma.",
      "Loading_Details": "Caricamento dei dettagli della conferma…",
      "Covered_Products_Heading": "Prodotti coperti",
      "Basket_Id_Label": "ID carrello:",
      "Total_Label": "Totale",
      "Item_Fallback": "Articolo",
      "Need_Help_Heading": "Hai bisogno di aiuto?",
      "Need_Help_Body": "Tieni a portata di mano il tuo riferimento e contatta l'assistenza per qualsiasi domanda sulla copertura.",
      "Home_Button": "Home"
    },
    "fr": {
      "Page_Title": "Commande confirmée",
      "Payment_Confirmed_Badge": "Paiement confirmé",
      "Thank_You_Heading": "Merci — votre couverture est désormais active.",
      "Thank_You_Subtext": "Conservez cette page pour vos archives. Nous avons envoyé un reçu par e-mail si une adresse a été fournie.",
      "Total_Paid_Label": "Total payé",
      "Ref_Label": "Réf. :",
      "No_Basket_Reference": "Nous n'avons trouvé aucune référence de panier pour cette confirmation.",
      "Loading_Details": "Chargement des détails de votre confirmation…",
      "Covered_Products_Heading": "Produits couverts",
      "Basket_Id_Label": "ID du panier :",
      "Total_Label": "Total",
      "Item_Fallback": "Article",
      "Need_Help_Heading": "Besoin d'aide ?",
      "Need_Help_Body": "Gardez votre référence à portée de main et contactez le support pour toute question sur votre couverture.",
      "Home_Button": "Accueil"
    },
    "de": {
      "Page_Title": "Bestellung bestätigt",
      "Payment_Confirmed_Badge": "Zahlung bestätigt",
      "Thank_You_Heading": "Vielen Dank — Ihr Schutz ist jetzt aktiv.",
      "Thank_You_Subtext": "Bewahren Sie diese Seite für Ihre Unterlagen auf. Falls eine Adresse angegeben wurde, haben wir eine Quittung per E-Mail gesendet.",
      "Total_Paid_Label": "Gezahlter Betrag",
      "Ref_Label": "Ref.:",
      "No_Basket_Reference": "Wir konnten für diese Bestätigung keine Warenkorb-Referenz finden.",
      "Loading_Details": "Ihre Bestätigungsdetails werden geladen…",
      "Covered_Products_Heading": "Geschützte Produkte",
      "Basket_Id_Label": "Warenkorb-ID:",
      "Total_Label": "Gesamt",
      "Item_Fallback": "Artikel",
      "Need_Help_Heading": "Brauchen Sie Hilfe?",
      "Need_Help_Body": "Halten Sie Ihre Referenz bereit und wenden Sie sich bei Fragen zu Ihrem Schutz an den Support.",
      "Home_Button": "Startseite"
    },
    "nl": {
      "Page_Title": "Bestelling bevestigd",
      "Payment_Confirmed_Badge": "Betaling bevestigd",
      "Thank_You_Heading": "Bedankt — uw dekking is nu actief.",
      "Thank_You_Subtext": "Bewaar deze pagina voor uw administratie. Als er een adres is opgegeven, hebben we een bon gemaild.",
      "Total_Paid_Label": "Totaal betaald",
      "Ref_Label": "Ref.:",
      "No_Basket_Reference": "We konden geen mandjereferentie vinden voor deze bevestiging.",
      "Loading_Details": "Uw bevestigingsgegevens laden…",
      "Covered_Products_Heading": "Gedekte producten",
      "Basket_Id_Label": "Mandje-ID:",
      "Total_Label": "Totaal",
      "Item_Fallback": "Item",
      "Need_Help_Heading": "Hulp nodig?",
      "Need_Help_Body": "Houd uw referentie bij de hand en neem contact op met support als u vragen hebt over uw dekking.",
      "Home_Button": "Home"
    },
    "tr": {
      "Page_Title": "Sipariş onaylandı",
      "Payment_Confirmed_Badge": "Ödeme onaylandı",
      "Thank_You_Heading": "Teşekkürler — teminatınız artık etkin.",
      "Thank_You_Subtext": "Bu sayfayı kayıtlarınız için saklayın. Bir adres verildiyse makbuzu e-postayla gönderdik.",
      "Total_Paid_Label": "Ödenen toplam",
      "Ref_Label": "Ref.:",
      "No_Basket_Reference": "Bu onay için bir sepet referansı bulamadık.",
      "Loading_Details": "Onay bilgileriniz yükleniyor…",
      "Covered_Products_Heading": "Teminat kapsamındaki ürünler",
      "Basket_Id_Label": "Sepet kimliği:",
      "Total_Label": "Toplam",
      "Item_Fallback": "Ürün",
      "Need_Help_Heading": "Yardım mı gerekiyor?",
      "Need_Help_Body": "Referansınızı hazır bulundurun ve teminatınızla ilgili sorularınız için destek ekibiyle iletişime geçin.",
      "Home_Button": "Ana sayfa"
    },
    "pt": {
      "Page_Title": "Encomenda confirmada",
      "Payment_Confirmed_Badge": "Pagamento confirmado",
      "Thank_You_Heading": "Obrigado — a sua cobertura está agora ativa.",
      "Thank_You_Subtext": "Guarde esta página para os seus registos. Enviámos um recibo por e-mail se tiver indicado um endereço.",
      "Total_Paid_Label": "Total pago",
      "Ref_Label": "Ref.:",
      "No_Basket_Reference": "Não encontrámos qualquer referência de cesto para esta confirmação.",
      "Loading_Details": "A carregar os detalhes da sua confirmação…",
      "Covered_Products_Heading": "Produtos cobertos",
      "Basket_Id_Label": "ID do cesto:",
      "Total_Label": "Total",
      "Item_Fallback": "Artigo",
      "Need_Help_Heading": "Precisa de ajuda?",
      "Need_Help_Body": "Tenha a sua referência à mão e contacte o suporte se tiver dúvidas sobre a sua cobertura.",
      "Home_Button": "Início"
    }
  },
  "error-page": {
    "en": {
      "Page_Title": "Something went wrong",
      "No_Offers_Heading": "No offers available",
      "No_Offers_Description": "We couldn't find any protection plans for this device right now.",
      "No_Offers_Hint": "Try adjusting product info or returning later. Our catalogue updates frequently.",
      "Invalid_Quote_Heading": "Invalid or expired quote",
      "Invalid_Quote_Description": "The quote link you used is no longer valid.",
      "Invalid_Quote_Hint": "Start a fresh registration to obtain a new quote.",
      "Upstream_Heading": "Upstream service issue",
      "Upstream_Description": "A dependent service failed to respond in time.",
      "Upstream_Hint": "This is usually temporary. Retrying often succeeds.",
      "Generic_Heading": "Something went wrong",
      "Generic_Description": "An unexpected error occurred.",
      "Generic_Hint": "If this persists, contact support with the reference below.",
      "Status_Prefix": "status",
      "Ref_Label": "Ref:",
      "Show_Details": "Show technical details",
      "Hide_Details": "Hide technical details",
      "Copy_Button": "Copy",
      "Copy_Aria_Label": "Copy error details",
      "Copied_Message": "Copied!",
      "Go_Back_Button": "Go back",
      "Start_Over_Button": "Start over",
      "Support_Button": "Support",
      "Actions_Aria_Label": "Error actions",
      "Timestamp_Label": "Timestamp:",
      "Status_Label": "Status:",
      "Status_Not_Available": "N/A"
    },
    "es": {
      "Page_Title": "Algo ha salido mal",
      "No_Offers_Heading": "No hay ofertas disponibles",
      "No_Offers_Description": "Ahora mismo no hemos encontrado planes de protección para este dispositivo.",
      "No_Offers_Hint": "Prueba a ajustar la información del producto o vuelve más tarde. Nuestro catálogo se actualiza con frecuencia.",
      "Invalid_Quote_Heading": "Presupuesto no válido o caducado",
      "Invalid_Quote_Description": "El enlace del presupuesto que has usado ya no es válido.",
      "Invalid_Quote_Hint": "Inicia un nuevo registro para obtener otro presupuesto.",
      "Upstream_Heading": "Problema con un servicio externo",
      "Upstream_Description": "Un servicio del que dependemos no ha respondido a tiempo.",
      "Upstream_Hint": "Suele ser temporal. Volver a intentarlo casi siempre funciona.",
      "Generic_Heading": "Algo ha salido mal",
      "Generic_Description": "Se ha producido un error inesperado.",
      "Generic_Hint": "Si el problema continúa, ponte en contacto con soporte indicando la referencia siguiente.",
      "Status_Prefix": "estado",
      "Ref_Label": "Ref.:",
      "Show_Details": "Mostrar detalles técnicos",
      "Hide_Details": "Ocultar detalles técnicos",
      "Copy_Button": "Copiar",
      "Copy_Aria_Label": "Copiar los detalles del error",
      "Copied_Message": "¡Copiado!",
      "Go_Back_Button": "Volver",
      "Start_Over_Button": "Empezar de nuevo",
      "Support_Button": "Soporte",
      "Actions_Aria_Label": "Acciones de error",
      "Timestamp_Label": "Marca de tiempo:",
      "Status_Label": "Estado:",
      "Status_Not_Available": "N/D"
    },
    "it": {
      "Page_Title": "Qualcosa è andato storto",
      "No_Offers_Heading": "Nessuna offerta disponibile",
      "No_Offers_Description": "Al momento non abbiamo trovato piani di protezione per questo dispositivo.",
      "No_Offers_Hint": "Prova a modificare i dati del prodotto o riprova più tardi. Il nostro catalogo si aggiorna spesso.",
      "Invalid_Quote_Heading": "Preventivo non valido o scaduto",
      "Invalid_Quote_Description": "Il link al preventivo che hai usato non è più valido.",
      "Invalid_Quote_Hint": "Avvia una nuova registrazione per ottenere un altro preventivo.",
      "Upstream_Heading": "Problema con un servizio esterno",
      "Upstream_Description": "Un servizio da cui dipendiamo non ha risposto in tempo.",
      "Upstream_Hint": "Di solito è temporaneo. Riprovare spesso funziona.",
      "Generic_Heading": "Qualcosa è andato storto",
      "Generic_Description": "Si è verificato un errore imprevisto.",
      "Generic_Hint": "Se il problema persiste, contatta l'assistenza indicando il riferimento qui sotto.",
      "Status_Prefix": "stato",
      "Ref_Label": "Rif.:",
      "Show_Details": "Mostra i dettagli tecnici",
      "Hide_Details": "Nascondi i dettagli tecnici",
      "Copy_Button": "Copia",
      "Copy_Aria_Label": "Copia i dettagli dell'errore",
      "Copied_Message": "Copiato!",
      "Go_Back_Button": "Torna indietro",
      "Start_Over_Button": "Ricomincia",
      "Support_Button": "Assistenza",
      "Actions_Aria_Label": "Azioni per l'errore",
      "Timestamp_Label": "Data e ora:",
      "Status_Label": "Stato:",
      "Status_Not_Available": "N/D"
    },
    "fr": {
      "Page_Title": "Une erreur est survenue",
      "No_Offers_Heading": "Aucune offre disponible",
      "No_Offers_Description": "Nous n'avons trouvé aucune formule de protection pour cet appareil pour le moment.",
      "No_Offers_Hint": "Essayez de modifier les informations du produit ou revenez plus tard. Notre catalogue est mis à jour fréquemment.",
      "Invalid_Quote_Heading": "Devis non valide ou expiré",
      "Invalid_Quote_Description": "Le lien de devis que vous avez utilisé n'est plus valide.",
      "Invalid_Quote_Hint": "Lancez un nouvel enregistrement pour obtenir un nouveau devis.",
      "Upstream_Heading": "Problème de service en amont",
      "Upstream_Description": "Un service dont nous dépendons n'a pas répondu à temps.",
      "Upstream_Hint": "C'est généralement temporaire. Réessayer suffit souvent.",
      "Generic_Heading": "Une erreur est survenue",
      "Generic_Description": "Une erreur inattendue s'est produite.",
      "Generic_Hint": "Si le problème persiste, contactez le support en indiquant la référence ci-dessous.",
      "Status_Prefix": "statut",
      "Ref_Label": "Réf. :",
      "Show_Details": "Afficher les détails techniques",
      "Hide_Details": "Masquer les détails techniques",
      "Copy_Button": "Copier",
      "Copy_Aria_Label": "Copier les détails de l'erreur",
      "Copied_Message": "Copié !",
      "Go_Back_Button": "Retour",
      "Start_Over_Button": "Recommencer",
      "Support_Button": "Assistance",
      "Actions_Aria_Label": "Actions liées à l'erreur",
      "Timestamp_Label": "Horodatage :",
      "Status_Label": "Statut :",
      "Status_Not_Available": "N/D"
    },
    "de": {
      "Page_Title": "Etwas ist schiefgelaufen",
      "No_Offers_Heading": "Keine Angebote verfügbar",
      "No_Offers_Description": "Wir konnten derzeit keine Schutzpakete für dieses Gerät finden.",
      "No_Offers_Hint": "Passen Sie die Produktangaben an oder versuchen Sie es später erneut. Unser Katalog wird häufig aktualisiert.",
      "Invalid_Quote_Heading": "Ungültiges oder abgelaufenes Angebot",
      "Invalid_Quote_Description": "Der von Ihnen verwendete Angebotslink ist nicht mehr gültig.",
      "Invalid_Quote_Hint": "Starten Sie eine neue Registrierung, um ein neues Angebot zu erhalten.",
      "Upstream_Heading": "Problem bei einem vorgelagerten Dienst",
      "Upstream_Description": "Ein abhängiger Dienst hat nicht rechtzeitig geantwortet.",
      "Upstream_Hint": "Das ist meist vorübergehend. Ein erneuter Versuch führt oft zum Erfolg.",
      "Generic_Heading": "Etwas ist schiefgelaufen",
      "Generic_Description": "Es ist ein unerwarteter Fehler aufgetreten.",
      "Generic_Hint": "Wenn das Problem weiterhin besteht, wenden Sie sich mit der untenstehenden Referenz an den Support.",
      "Status_Prefix": "Status",
      "Ref_Label": "Ref.:",
      "Show_Details": "Technische Details anzeigen",
      "Hide_Details": "Technische Details ausblenden",
      "Copy_Button": "Kopieren",
      "Copy_Aria_Label": "Fehlerdetails kopieren",
      "Copied_Message": "Kopiert!",
      "Go_Back_Button": "Zurück",
      "Start_Over_Button": "Neu beginnen",
      "Support_Button": "Support",
      "Actions_Aria_Label": "Fehleraktionen",
      "Timestamp_Label": "Zeitstempel:",
      "Status_Label": "Status:",
      "Status_Not_Available": "k. A."
    },
    "nl": {
      "Page_Title": "Er is iets misgegaan",
      "No_Offers_Heading": "Geen aanbiedingen beschikbaar",
      "No_Offers_Description": "We konden op dit moment geen beschermingsplannen voor dit apparaat vinden.",
      "No_Offers_Hint": "Pas de productgegevens aan of probeer het later opnieuw. Onze catalogus wordt vaak bijgewerkt.",
      "Invalid_Quote_Heading": "Ongeldige of verlopen offerte",
      "Invalid_Quote_Description": "De offertelink die u gebruikte is niet meer geldig.",
      "Invalid_Quote_Hint": "Start een nieuwe registratie om een nieuwe offerte te krijgen.",
      "Upstream_Heading": "Probleem met een externe dienst",
      "Upstream_Description": "Een dienst waarvan we afhankelijk zijn reageerde niet op tijd.",
      "Upstream_Hint": "Dit is meestal tijdelijk. Opnieuw proberen lukt vaak.",
      "Generic_Heading": "Er is iets misgegaan",
      "Generic_Description": "Er is een onverwachte fout opgetreden.",
      "Generic_Hint": "Als dit blijft gebeuren, neem dan contact op met support met de referentie hieronder.",
      "Status_Prefix": "status",
      "Ref_Label": "Ref.:",
      "Show_Details": "Technische details tonen",
      "Hide_Details": "Technische details verbergen",
      "Copy_Button": "Kopiëren",
      "Copy_Aria_Label": "Foutdetails kopiëren",
      "Copied_Message": "Gekopieerd!",
      "Go_Back_Button": "Terug",
      "Start_Over_Button": "Opnieuw beginnen",
      "Support_Button": "Support",
      "Actions_Aria_Label": "Foutacties",
      "Timestamp_Label": "Tijdstempel:",
      "Status_Label": "Status:",
      "Status_Not_Available": "N.v.t."
    },
    "tr": {
      "Page_Title": "Bir şeyler ters gitti",
      "No_Offers_Heading": "Uygun teklif yok",
      "No_Offers_Description": "Şu anda bu cihaz için koruma planı bulamadık.",
      "No_Offers_Hint": "Ürün bilgilerini düzenlemeyi deneyin veya daha sonra tekrar bakın. Kataloğumuz sık sık güncellenir.",
      "Invalid_Quote_Heading": "Geçersiz veya süresi dolmuş teklif",
      "Invalid_Quote_Description": "Kullandığınız teklif bağlantısı artık geçerli değil.",
      "Invalid_Quote_Hint": "Yeni bir teklif almak için kaydı yeniden başlatın.",
      "Upstream_Heading": "Bağlı serviste sorun",
      "Upstream_Description": "Bağımlı olduğumuz bir servis zamanında yanıt vermedi.",
      "Upstream_Hint": "Bu genellikle geçicidir. Yeniden denemek çoğu zaman işe yarar.",
      "Generic_Heading": "Bir şeyler ters gitti",
      "Generic_Description": "Beklenmeyen bir hata oluştu.",
      "Generic_Hint": "Sorun devam ederse aşağıdaki referansla destek ekibiyle iletişime geçin.",
      "Status_Prefix": "durum",
      "Ref_Label": "Ref.:",
      "Show_Details": "Teknik ayrıntıları göster",
      "Hide_Details": "Teknik ayrıntıları gizle",
      "Copy_Button": "Kopyala",
      "Copy_Aria_Label": "Hata ayrıntılarını kopyala",
      "Copied_Message": "Kopyalandı!",
      "Go_Back_Button": "Geri dön",
      "Start_Over_Button": "Baştan başla",
      "Support_Button": "Destek",
      "Actions_Aria_Label": "Hata işlemleri",
      "Timestamp_Label": "Zaman damgası:",
      "Status_Label": "Durum:",
      "Status_Not_Available": "Yok"
    },
    "pt": {
      "Page_Title": "Algo correu mal",
      "No_Offers_Heading": "Sem ofertas disponíveis",
      "No_Offers_Description": "De momento não encontrámos planos de proteção para este dispositivo.",
      "No_Offers_Hint": "Experimente ajustar os dados do produto ou volte mais tarde. O nosso catálogo é atualizado com frequência.",
      "Invalid_Quote_Heading": "Orçamento inválido ou expirado",
      "Invalid_Quote_Description": "A ligação de orçamento que utilizou já não é válida.",
      "Invalid_Quote_Hint": "Inicie um novo registo para obter outro orçamento.",
      "Upstream_Heading": "Problema num serviço externo",
      "Upstream_Description": "Um serviço do qual dependemos não respondeu a tempo.",
      "Upstream_Hint": "Normalmente é temporário. Tentar novamente costuma resultar.",
      "Generic_Heading": "Algo correu mal",
      "Generic_Description": "Ocorreu um erro inesperado.",
      "Generic_Hint": "Se o problema persistir, contacte o suporte indicando a referência abaixo.",
      "Status_Prefix": "estado",
      "Ref_Label": "Ref.:",
      "Show_Details": "Mostrar detalhes técnicos",
      "Hide_Details": "Ocultar detalhes técnicos",
      "Copy_Button": "Copiar",
      "Copy_Aria_Label": "Copiar os detalhes do erro",
      "Copied_Message": "Copiado!",
      "Go_Back_Button": "Voltar",
      "Start_Over_Button": "Começar de novo",
      "Support_Button": "Suporte",
      "Actions_Aria_Label": "Ações de erro",
      "Timestamp_Label": "Data e hora:",
      "Status_Label": "Estado:",
      "Status_Not_Available": "N/D"
    }
  },
  "shared-ui": {
    "en": {
      "Scanner_Heading": "Scan barcode",
      "Scanner_Help": "Point your camera at the barcode. We support EAN/GTIN (EAN-13/EAN-8/UPC) and Code 128.",
      "Scanner_Tip": "Tip: hold the phone steady, good lighting helps, and keep the barcode within the green box.",
      "Scanner_Cancel": "Cancel",
      "Scanner_Starting_Camera": "Starting camera…",
      "Scanner_Scanned_Value": "Scanned value",
      "Scanner_Scan_Again": "Scan again",
      "Scanner_Continue": "Continue",
      "Scanner_Open_Button": "Scan barcode",
      "Date_Placeholder": "Select date...",
      "Date_Day": "day",
      "Date_Month": "month",
      "Date_Year": "year",
      "Date_Clear": "Clear date",
      "Date_Clear_Button": "Clear"
    },
    "es": {
      "Scanner_Heading": "Escanear código de barras",
      "Scanner_Help": "Apunta la cámara al código de barras. Admitimos EAN/GTIN (EAN-13/EAN-8/UPC) y Code 128.",
      "Scanner_Tip": "Consejo: sujeta el teléfono con firmeza, una buena iluminación ayuda y mantén el código dentro del recuadro verde.",
      "Scanner_Cancel": "Cancelar",
      "Scanner_Starting_Camera": "Iniciando la cámara…",
      "Scanner_Scanned_Value": "Valor escaneado",
      "Scanner_Scan_Again": "Escanear de nuevo",
      "Scanner_Continue": "Continuar",
      "Scanner_Open_Button": "Escanear código de barras",
      "Date_Placeholder": "Selecciona una fecha...",
      "Date_Day": "día",
      "Date_Month": "mes",
      "Date_Year": "año",
      "Date_Clear": "Borrar la fecha",
      "Date_Clear_Button": "Borrar"
    },
    "it": {
      "Scanner_Heading": "Scansiona il codice a barre",
      "Scanner_Help": "Inquadra il codice a barre con la fotocamera. Supportiamo EAN/GTIN (EAN-13/EAN-8/UPC) e Code 128.",
      "Scanner_Tip": "Suggerimento: tieni fermo il telefono, una buona illuminazione aiuta e mantieni il codice dentro il riquadro verde.",
      "Scanner_Cancel": "Annulla",
      "Scanner_Starting_Camera": "Avvio della fotocamera…",
      "Scanner_Scanned_Value": "Valore scansionato",
      "Scanner_Scan_Again": "Scansiona di nuovo",
      "Scanner_Continue": "Continua",
      "Scanner_Open_Button": "Scansiona codice a barre",
      "Date_Placeholder": "Seleziona una data...",
      "Date_Day": "giorno",
      "Date_Month": "mese",
      "Date_Year": "anno",
      "Date_Clear": "Cancella la data",
      "Date_Clear_Button": "Cancella"
    },
    "fr": {
      "Scanner_Heading": "Scanner le code-barres",
      "Scanner_Help": "Dirigez votre caméra vers le code-barres. Nous prenons en charge EAN/GTIN (EAN-13/EAN-8/UPC) et Code 128.",
      "Scanner_Tip": "Astuce : tenez le téléphone bien stable, un bon éclairage aide, et gardez le code-barres dans le cadre vert.",
      "Scanner_Cancel": "Annuler",
      "Scanner_Starting_Camera": "Démarrage de la caméra…",
      "Scanner_Scanned_Value": "Valeur scannée",
      "Scanner_Scan_Again": "Scanner à nouveau",
      "Scanner_Continue": "Continuer",
      "Scanner_Open_Button": "Scanner le code-barres",
      "Date_Placeholder": "Sélectionnez une date...",
      "Date_Day": "jour",
      "Date_Month": "mois",
      "Date_Year": "année",
      "Date_Clear": "Effacer la date",
      "Date_Clear_Button": "Effacer"
    },
    "de": {
      "Scanner_Heading": "Barcode scannen",
      "Scanner_Help": "Richten Sie die Kamera auf den Barcode. Wir unterstützen EAN/GTIN (EAN-13/EAN-8/UPC) und Code 128.",
      "Scanner_Tip": "Tipp: Halten Sie das Telefon ruhig, gutes Licht hilft, und halten Sie den Barcode im grünen Rahmen.",
      "Scanner_Cancel": "Abbrechen",
      "Scanner_Starting_Camera": "Kamera wird gestartet…",
      "Scanner_Scanned_Value": "Gescannter Wert",
      "Scanner_Scan_Again": "Erneut scannen",
      "Scanner_Continue": "Weiter",
      "Scanner_Open_Button": "Barcode scannen",
      "Date_Placeholder": "Datum auswählen...",
      "Date_Day": "Tag",
      "Date_Month": "Monat",
      "Date_Year": "Jahr",
      "Date_Clear": "Datum löschen",
      "Date_Clear_Button": "Löschen"
    },
    "nl": {
      "Scanner_Heading": "Barcode scannen",
      "Scanner_Help": "Richt uw camera op de barcode. We ondersteunen EAN/GTIN (EAN-13/EAN-8/UPC) en Code 128.",
      "Scanner_Tip": "Tip: houd de telefoon stil, goede verlichting helpt, en houd de barcode binnen het groene kader.",
      "Scanner_Cancel": "Annuleren",
      "Scanner_Starting_Camera": "Camera starten…",
      "Scanner_Scanned_Value": "Gescande waarde",
      "Scanner_Scan_Again": "Opnieuw scannen",
      "Scanner_Continue": "Doorgaan",
      "Scanner_Open_Button": "Barcode scannen",
      "Date_Placeholder": "Selecteer een datum...",
      "Date_Day": "dag",
      "Date_Month": "maand",
      "Date_Year": "jaar",
      "Date_Clear": "Datum wissen",
      "Date_Clear_Button": "Wissen"
    },
    "tr": {
      "Scanner_Heading": "Barkod tara",
      "Scanner_Help": "Kameranızı barkoda doğrultun. EAN/GTIN (EAN-13/EAN-8/UPC) ve Code 128 destekliyoruz.",
      "Scanner_Tip": "İpucu: telefonu sabit tutun, iyi aydınlatma yardımcı olur ve barkodu yeşil çerçevenin içinde tutun.",
      "Scanner_Cancel": "İptal",
      "Scanner_Starting_Camera": "Kamera başlatılıyor…",
      "Scanner_Scanned_Value": "Taranan değer",
      "Scanner_Scan_Again": "Tekrar tara",
      "Scanner_Continue": "Devam et",
      "Scanner_Open_Button": "Barkod tara",
      "Date_Placeholder": "Tarih seçin...",
      "Date_Day": "gün",
      "Date_Month": "ay",
      "Date_Year": "yıl",
      "Date_Clear": "Tarihi temizle",
      "Date_Clear_Button": "Temizle"
    },
    "pt": {
      "Scanner_Heading": "Ler código de barras",
      "Scanner_Help": "Aponte a câmara ao código de barras. Suportamos EAN/GTIN (EAN-13/EAN-8/UPC) e Code 128.",
      "Scanner_Tip": "Dica: segure o telemóvel firme, boa iluminação ajuda, e mantenha o código dentro da caixa verde.",
      "Scanner_Cancel": "Cancelar",
      "Scanner_Starting_Camera": "A iniciar a câmara…",
      "Scanner_Scanned_Value": "Valor lido",
      "Scanner_Scan_Again": "Ler novamente",
      "Scanner_Continue": "Continuar",
      "Scanner_Open_Button": "Ler código de barras",
      "Date_Placeholder": "Selecione uma data...",
      "Date_Day": "dia",
      "Date_Month": "mês",
      "Date_Year": "ano",
      "Date_Clear": "Limpar a data",
      "Date_Clear_Button": "Limpar"
    }
  }
};

function valuesFor(singleType, code) {
  const byLang = CONTENT[singleType];
  const base = String(code || '').toLowerCase().split('-')[0];
  return byLang[base] || byLang.en;
}

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

// Locales skipped because their current entry could not be read, and locales
// whose save or publish failed. Both are reported at the end and make the run
// exit non-zero, so a partial run is not mistaken for a complete one.
const readFailures = [];
const writeFailures = [];

async function seedSingleType(singleType, locales, defaultLocale, token) {
  const cmBase = `/content-manager/single-types/api::${singleType}.${singleType}`;
  const ordered = [defaultLocale, ...locales.filter((l) => l.code !== defaultLocale.code)];
  console.log(`\n=== ${singleType} ===`);

  for (const locale of ordered) {
    const values = valuesFor(singleType, locale.code);
    const translated = values !== CONTENT[singleType].en || String(locale.code).toLowerCase().startsWith('en');

    // Read the current entry so we only add what is missing and never drop
    // fields this script does not know about. A read that fails for any other
    // reason than "this localization does not exist yet" must not be treated as
    // an empty entry: doing so would make every key look blank and the PUT below
    // would overwrite existing translations, breaking the additive guarantee.
    const current = await request('GET', `${cmBase}?locale=${locale.code}`, null, token);
    let existing;
    if (current.status >= 200 && current.status < 300) {
      existing = (current.body && current.body.data) || {};
    } else if (current.status === 404) {
      existing = {}; // confirmed: no entry for this locale yet
    } else if (FORCE) {
      existing = {}; // --force overwrites regardless, so the read does not matter
    } else {
      console.warn(`! ${locale.code} — skipped: could not read the current entry (HTTP ${current.status}). Re-run once it is readable, or pass --force to write anyway.`);
      readFailures.push(`${singleType}/${locale.code}`);
      continue;
    }

    const payload = {};
    const skipped = [];
    for (const [key, value] of Object.entries(values)) {
      if (!FORCE && !isBlank(existing[key])) {
        skipped.push(key);
        continue;
      }
      payload[key] = value;
    }

    if (Object.keys(payload).length === 0) {
      console.log(`· ${locale.code} — nothing to add (${skipped.length} already set).`);
      continue;
    }

    const label = translated ? 'translated' : 'English fallback';
    console.log(`Writing ${Object.keys(payload).length} ${label} value(s) to ${locale.code}${skipped.length ? ` (keeping ${skipped.length} existing)` : ''}…`);

    // The locale MUST be in the body for writes. Strapi's content-manager
    // single-type controllers read it from the query only for the GET above;
    // update and publish take it from the request body, so a query-only locale
    // silently writes and publishes the default locale every time.
    const saveRes = await request('PUT', `${cmBase}?locale=${locale.code}`, { ...payload, locale: locale.code }, token);
    if (saveRes.status >= 200 && saveRes.status < 300) {
      console.log(`✓ ${locale.code} — saved.`);
    } else {
      console.warn(`✗ ${locale.code} save failed:`, JSON.stringify(saveRes.body, null, 2));
      writeFailures.push(`${singleType}/${locale.code} (save)`);
      continue;
    }

    const pubRes = await request('POST', `${cmBase}/actions/publish?locale=${locale.code}`, { locale: locale.code }, token);
    if (pubRes.status >= 200 && pubRes.status < 300) {
      console.log(`✓ ${locale.code} — published.`);
    } else if (pubRes.body && pubRes.body.error && pubRes.body.error.message === 'already.published') {
      console.log(`✓ ${locale.code} — already published (updated in place).`);
    } else {
      console.warn(`✗ ${locale.code} publish failed:`, JSON.stringify(pubRes.body, null, 2));
      writeFailures.push(`${singleType}/${locale.code} (publish)`);
    }
  }
}

async function main() {
  console.log(`Connecting to Strapi at ${BASE_URL}…`);

  const loginRes = await request('POST', '/admin/login', { email: EMAIL, password: PASSWORD });
  if (loginRes.status !== 200) {
    console.error('Login failed:', JSON.stringify(loginRes.body));
    process.exit(1);
  }
  const token = loginRes.body && loginRes.body.data && loginRes.body.data.token;
  console.log('Logged in successfully.');

  const localesRes = await request('GET', '/i18n/locales', null, token);
  const locales = localesRes.body;
  if (!Array.isArray(locales) || locales.length === 0) {
    console.error('Could not read locales:', JSON.stringify(localesRes.body));
    process.exit(1);
  }
  const defaultLocale = locales.find((l) => l.isDefault) || locales[0];
  console.log(`Default locale: ${defaultLocale.code}`);
  console.log(`All locales: ${locales.map((l) => l.code).join(', ')}`);
  if (FORCE) console.log('Running with --force: existing values will be overwritten.');

  const wanted = ONLY ? ONLY.split(',').map((s) => s.trim()).filter(Boolean) : Object.keys(CONTENT);
  for (const singleType of wanted) {
    if (!CONTENT[singleType]) {
      console.warn(`Skipping unknown single type "${singleType}".`);
      continue;
    }
    await seedSingleType(singleType, locales, defaultLocale, token);
  }

  if (readFailures.length || writeFailures.length) {
    console.warn('\nDone, but the run was incomplete.');
    if (readFailures.length) {
      console.warn(`\n${readFailures.length} locale(s) skipped because their current entry could not be read:`);
      for (const f of readFailures) console.warn(`  - ${f}`);
      console.warn('Nothing was overwritten for those. Re-run once they are readable.');
    }
    if (writeFailures.length) {
      console.warn(`\n${writeFailures.length} write(s) failed:`);
      for (const f of writeFailures) console.warn(`  - ${f}`);
      console.warn('Those translations are not seeded. Re-run once the cause is fixed.');
    }
    process.exitCode = 1;
    return;
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
