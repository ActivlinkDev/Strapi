'use strict';

/**
 * prop service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::prop.prop');
