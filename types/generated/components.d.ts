import type { Schema, Struct } from '@strapi/strapi';

export interface OfferDamageExample extends Struct.ComponentSchema {
  collectionName: 'components_offer_damage_examples';
  info: {
    description: 'One illustrative problem the cover can help with, shown on the offer page';
    displayName: 'Damage_Example';
  };
  attributes: {
    Cover_Type: Schema.Attribute.Enumeration<['breakdown', 'accidental']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'breakdown'>;
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Enumeration<
      [
        'crack',
        'liquid',
        'drop',
        'power',
        'motor',
        'leak',
        'heat',
        'screen',
        'door',
        'noise',
        'electrical',
      ]
    >;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'offer.damage-example': OfferDamageExample;
    }
  }
}
