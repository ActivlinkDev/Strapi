'use strict';

const { errors: { ValidationError } } = require('@strapi/utils');
const defaults = require('../../../../../translations/my-registrations.json').en;

const placeholders = value => (value.match(/\{[^{}]+\}/g) || []).sort().join(',');

// Validate supplied fields only: Strapi handles required fields on publication,
// and a partial update must not require editors to resubmit the whole page.
function validate({ params: { data } }) {
  for (const [key, fallback] of Object.entries(defaults)) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const value = data[key];
    if (typeof value !== 'string' || !value.trim()) {
      throw new ValidationError(`${key} must contain text.`);
    }
    if (placeholders(value) !== placeholders(fallback)) {
      throw new ValidationError(`${key} must preserve these placeholders: ${placeholders(fallback) || '(none)'}.`);
    }
  }
}

module.exports = { beforeCreate: validate, beforeUpdate: validate };
