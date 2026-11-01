'use strict';

/**
 * assistance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::assistance.assistance');
