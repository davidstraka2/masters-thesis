export const inventoryJSONFormsDataSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of your business/inventory',
    },
    description: {
      type: 'string',
    },
    url: {
      type: 'string',
      format: 'uri',
      title: 'Website',
    },
    contact: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email address',
        },
        telephone: {
          type: 'string',
          title: 'Phone',
          description: 'Phone number',
        },
        address: {
          type: 'string',
          title: 'Location',
          description: 'Physical address',
        },
        openingHours: {
          type: 'string',
          description: 'Opening hours can be specified as a weekly time range, starting with days,' +
            ' then times per day. Multiple days can be listed with commas \',\' separating each day.' +
            ' Day or time ranges are specified using a hyphen \'-\'.' +
            ' Days are specified using the following two-letter combinations: Mo, Tu, We, Th, Fr, Sa, Su.' +
            ' Times are specified using 24:00 format. For example, 3pm is specified as 15:00, 10am as 10:00.' +
            ' For instance, \'Tu,Th 16:00-20:00\' means open on Tuesdays and Thursdays 4-8pm.',
        },
      },
    },
  },
  required: ['name'],
};
