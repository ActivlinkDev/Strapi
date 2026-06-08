'use strict';

/**
 * Seed script: populates the my-contracts single type with English default values.
 * Usage: node seed-my-contracts.js <adminEmail> <adminPassword>
 * Example: node seed-my-contracts.js admin@example.com mypassword
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL    = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed-my-contracts.js <adminEmail> <adminPassword>');
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

const EN_VALUES = {
  // Page
  Page_Title: 'My Contracts',

  // Identity verification — collect step
  Verify_heading: 'Verify your identity',
  Verify_subtext: 'Use your phone number to unlock a calm, device-first view of your cover and policy documents.',
  Send_verification_code: 'Send verification code',

  // Identity verification — OTP step
  Enter_code_heading: 'Enter your code',
  Enter_code_subtext: 'We sent a 6-digit code to {destination}. Once you enter it, your contracts will be ready to view.',
  Change_phone_number: 'Change phone number',

  // Error messages
  Error_send_code: 'Failed to send verification code. Please try again.',
  Error_network: 'Network error. Please check your connection and try again.',
  Error_code_expired: 'This code has expired. Please request a new one.',
  Error_too_many_attempts: 'Too many incorrect attempts. Please request a new code.',
  Error_incorrect_code: 'Incorrect code. Please try again.',
  Error_account_not_found: 'Could not locate your account. Please contact support.',
  Error_verification_failed: 'Verification failed. Please try again.',
  Error_network_contracts: 'Network error loading contracts.',
  Error_load_contracts: 'Failed to load your contracts ({detail}). Please refresh to try again.',
  Error_something_wrong: 'Something went wrong',

  // Loading
  Loading_contracts: 'Loading your contracts...',

  // Overview hero
  Verified_for: 'Verified for {phone}',
  Overview_heading_named: '{firstName}, here is your protection overview.',
  Overview_heading: 'Your protection overview.',
  Overview_subtext: 'Keep track of what is covered, when each plan started, and which documents are ready whenever you need them.',
  Active_devices_protected: '{count} active device protected',
  Active_devices_protected_plural: '{count} active devices protected',
  Plans_on_file: '{count} plan on file',
  Plans_on_file_plural: '{count} plans on file',

  // At a glance
  At_a_glance: 'At a glance',
  Devices_covered: 'Devices covered',
  Documents_available: 'Documents available',
  Calm_next_step: 'Calm next step',
  Calm_next_step_text: 'Open a card to view documents, check dates, or confirm what each device is covered for.',

  // Summary bar stats
  Stat_covered_devices: 'Covered devices',
  Stat_active_plans: 'Active plans',
  Stat_awaiting_activation: 'Awaiting activation',
  Stat_documents_ready: 'Documents ready',

  // Status labels
  Status_active: 'Active',
  Status_pending_activation: 'Pending activation',
  Status_expired: 'Expired',
  Status_cancelled: 'Cancelled',
  Status_renewed: 'Renewed',
  Status_void: 'Void',
  Status_unknown: 'Unknown',

  // Device card
  Protected_device: 'Protected device',
  Covered_for: 'You are covered for {products}.',
  Cover_details_placeholder: 'Your cover details are stored here for quick access whenever you need them.',
  Plan_value: 'Plan value',
  Started: 'Started',
  Next_payment: 'Next payment',
  Cover_until: 'Cover until',
  Awaiting_activation: 'Awaiting activation',
  See_details: 'See details',
  What_is_covered: 'What is covered',
  View_policy: 'View policy',
  View_cover_summary: 'View cover summary',
  Hide_details: 'Hide details',
  View_details: 'View details',
  Hide_cover_breakdown: 'Hide cover breakdown',
  View_cover_breakdown: 'View cover breakdown',

  // Journey strip
  Journey_status_today: 'Status today',
  Journey_awaiting_timeline: 'Awaiting timeline',
  Journey_check_details: 'Check details below',

  // Contract breakdown detail items
  Detail_device: 'Device',
  Detail_cover_type: 'Cover type',
  Detail_start_date: 'Start date',
  Detail_end_date: 'End date',
  Detail_end_tbc: 'To be confirmed',
  Detail_term_months: '{n} month term',
  Detail_term_pending: 'Term pending confirmation',
  Detail_not_available: 'Not available',
  Detail_price_tbc: 'Price to be confirmed',

  // Empty state
  Empty_heading: 'No contracts found',
  Empty_subtext: 'We could not find any protection plans linked to this verified account yet.',

  // Plural / subtitle strings
  Cover_items_singular: '{n} cover item included',
  Cover_items_plural: '{n} cover items included',
  Fallback_plans_singular: '{n} plan on file',
  Fallback_plans_plural: '{n} plans on file',

  // Fallback labels
  Fallback_covered_device: 'Covered device {n}',
  Fallback_protection_plan: 'Protection plan',
  Fallback_device_protection: '{device} protection',

  // Reset button
  Use_different_number: 'Use a different number',
};

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

  // 3. Write English values to the default locale first
  const cmBase = '/content-manager/single-types/api::my-contracts.my-contracts';
  console.log(`\nWriting English values to default locale (${defaultLocale.code})…`);
  const defaultRes = await request('PUT', `${cmBase}?locale=${defaultLocale.code}`, EN_VALUES, token);
  if (defaultRes.status >= 200 && defaultRes.status < 300) {
    console.log(`✓ ${defaultLocale.code} — saved.`);
  } else {
    console.error(`✗ ${defaultLocale.code} failed:`, JSON.stringify(defaultRes.body, null, 2));
    process.exit(1);
  }

  // 4. Create placeholder entries for all other locales (English values as fallback)
  const otherLocales = locales.filter(l => l.code !== defaultLocale.code);
  for (const locale of otherLocales) {
    console.log(`Writing placeholder values to ${locale.code}…`);
    const res = await request('PUT', `${cmBase}?locale=${locale.code}`, EN_VALUES, token);
    if (res.status >= 200 && res.status < 300) {
      console.log(`✓ ${locale.code} — saved.`);
    } else {
      console.warn(`✗ ${locale.code} failed:`, JSON.stringify(res.body, null, 2));
    }
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
