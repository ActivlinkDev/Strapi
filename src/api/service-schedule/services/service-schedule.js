'use strict';

/**
 * service-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service-schedule.service-schedule');
