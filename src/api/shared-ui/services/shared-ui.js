'use strict';

/**
 * shared-ui service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::shared-ui.shared-ui');
