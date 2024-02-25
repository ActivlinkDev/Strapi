'use strict';

/**
 * device-entry service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::device-entry.device-entry');
