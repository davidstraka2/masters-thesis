interface Inventory {
    id: string;
    meta?: object; // JSON-LD
    form?: object; // JSON Schema
    itemType?: string; // JSON-LD context for the item meta
    itemMetaSchema?: object; // JSON Schema
    items?: Array<{
        id: string;
        xor?: string[]; // IDs of mutually exclusive items
        capacity?: number;
        bookDeadline?: string; // ISO 8601
        meta?: object; // JSON-LD
        occupancy?: number; // Number of bookings of the item
    }>;
}
