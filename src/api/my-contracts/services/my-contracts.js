'use strict';

/**
 * my-contracts service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::my-contracts.my-contracts');
