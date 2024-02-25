'use strict';

/**
 * locale-info service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::locale-info.locale-info');
