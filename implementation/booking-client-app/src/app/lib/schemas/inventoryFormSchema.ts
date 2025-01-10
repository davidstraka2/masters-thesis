export const inventoryFormSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Your full name',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Your email address',
    },
    telephone: {
      type: 'string',
      title: 'Phone',
      description: 'Your phone number',
    },
  },
  required: ['name', 'email'],
};
