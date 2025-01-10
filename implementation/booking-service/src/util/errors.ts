export class BookingAddressConflictError extends Error {
  constructor() {
    super('Address already exists');
  }
}

export class NoBookingAddressFoundError extends Error {
  constructor() {
    super('No booking address was found');
  }
}

export class NoItemFoundForBookingError extends Error {
  constructor() {
    super('No item of given id under given booking address was found');
  }
}

export class InvalidFormDataError extends Error {
  constructor() {
    super('Invalid form data');
  }
}

export class ItemAfterBookDeadlineError extends Error {
  constructor() {
    super('The item book deadline is over');
  }
}

export class ItemAlreadyBookedError extends Error {
  constructor() {
    super('The item has already been booked under the given booking address');
  }
}

export class ItemFullyBookedError extends Error {
  constructor() {
    super('The item is full (its capacity has been reached)');
  }
}

export class OneBookingAddressPerUserError extends Error {
  constructor() {
    super('One user cannot have multiple addresses');
  }
}
