export const publicConfig = {
  api: process.env.NEXT_PUBLIC_API ?? "http://localhost:3080",
  bookingAddressAt: process.env.NEXT_PUBLIC_BOOKING_ADDRESS_AT ?? "localhost:3080",
};
