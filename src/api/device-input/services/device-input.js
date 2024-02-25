'use strict';

/**
 * device-input service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::device-input.device-input');
