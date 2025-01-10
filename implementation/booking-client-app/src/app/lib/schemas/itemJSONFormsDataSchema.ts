export const itemJSONFormsDataSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the item',
    },
    description: {
      type: 'string',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Date and time of the start of the event',
    },
    duration: {
      type: 'string',
      format: 'duration',
      description: 'Duration of the event. Must be in ISO 8601 duration format, e.g. "PT1H30M" meaning 1 hour 30 minutes.',
    },
    url: {
      type: 'string',
      format: 'uri',
      title: 'Website',
      description: 'Website of the event',
    },
    location: {
      type: 'string',
      description: 'Address of physical location of the event',
    },
    capacity: {
      type: 'integer',
      minimum: 0,
      description: 'How many people can book this item (if left empty, the capacity will be unlimited)',
    },
    bookDeadline: {
      type: 'string',
      format: 'date-time',
      description: 'Until when can people book this item (if left empty, it will be identical to the start date)',
    },
  },
  required: ['name', 'startDate'],
};
