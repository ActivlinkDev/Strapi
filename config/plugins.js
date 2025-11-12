// ./config/plugins.js
module.exports = ({ env }) => ({
  'users-permissions': {
    config: { jwtSecret: env('JWT_SECRET') },
  },

  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: { upload: {}, delete: {} },
    },
  },

  // 🌍 DeepL translation provider
  translate: {
    enabled: true,
    config: {
      provider: 'deepl',
      providerOptions: {
        // must be server_url + api_key
        server_url: env('DEEPL_SERVER_URL', 'https://api-free.deepl.com'),
        api_key: env('DEEPL_API_KEY'),
      },
      localesMap: {
        'en': 'EN', 'en-GB': 'EN',
        'fr': 'FR', 'fr-FR': 'FR',
        'es': 'ES', 'es-ES': 'ES',
        'de': 'DE', 'de-DE': 'DE',
        'it': 'IT', 'it-IT': 'IT',
        'nl': 'NL', 'nl-NL': 'NL',
        'tr': 'TR', 'tr-TR': 'TR',
      },
      copyOnFailure: false,
    },
  },
});
