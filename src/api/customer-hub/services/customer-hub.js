'use strict';

/**
 * customer-hub service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customer-hub.customer-hub');
