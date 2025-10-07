'use strict';

/**
 * validate-customer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::validate-customer.validate-customer');
