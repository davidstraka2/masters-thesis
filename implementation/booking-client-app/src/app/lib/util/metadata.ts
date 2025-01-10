export function formatMetadataItemValue(key: string | null, value: unknown): string {
  if (typeof value === 'string') {
    switch (key) {
      case 'startDate':
        try {
          const date = new Date(value);
          return date.toLocaleString();
        } catch {
          return value;
        }
      default:
        return value;
    }
  }
  return JSON.stringify(value);
}
