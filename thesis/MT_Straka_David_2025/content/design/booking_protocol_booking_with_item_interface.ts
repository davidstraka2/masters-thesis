interface BookingWithItem {
    id: string;
    createdAt?: string;
    formData?: object;
    item: {
        id: string;
        capacity?: number;
        bookDeadline?: string;
        meta?: object;
    };
}
