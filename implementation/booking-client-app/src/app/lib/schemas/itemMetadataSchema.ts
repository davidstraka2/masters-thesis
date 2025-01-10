export const itemMetadataSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the item',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Date and time of the start of the event',
    },
    duration: {
      type: 'string',
      format: 'duration',
      description: 'Duration of the event in ISO 8601 duration format, e.g. "PT1H30M" meaning 1 hour 30 minutes.',
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
  },
  required: ['name', 'startDate'],
};
