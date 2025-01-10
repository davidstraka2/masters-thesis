import { BadRequestException } from '@nestjs/common';
import {
  isFQDN,
  isIP,
  registerDecorator,
  validate,
  ValidationOptions,
} from 'class-validator';
import { BookingAddressDto } from './booking-address.dto';

const LOCALHOST_HOSTNAMES = ['::1', '127.0.0.1', 'localhost'];
const PORT_DEFAULT = 3080;
const PORT_DELIMITER = ':';
const PORT_MAX_VALUE = 65535;
const USERNAME_DELIMITER = '@';
const USERNAME_MAX_LENGTH = 64;
const USERNAME_PATTERN = /^[0-9A-Za-z._-]+?$/;

type ParsedBookingAddress = {
  username: string;
  hostname: string;
  port?: string;
};

export function IsBookingAddress(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBookingAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          let parts = value.split(USERNAME_DELIMITER);
          if (parts.length !== 2) return false;
          const [username, host] = parts;
          if (username.length > USERNAME_MAX_LENGTH) return false;
          if (!USERNAME_PATTERN.test(username)) return false;
          parts = host.split(PORT_DELIMITER);
          if (parts.length > 2) return false;
          if (parts.length === 2) {
            const [, port] = parts;
            if (!/^[0-9]+$/.test(port)) return false;
            const portNumber = parseInt(port, 10);
            if (portNumber < 0) return false;
            if (portNumber > PORT_MAX_VALUE) return false;
          }
          const [hostname] = parts;
          if (!isIP(hostname) && !isFQDN(hostname) && hostname !== 'localhost')
            return false;
          return true;
        },
      },
    });
  };
}

export function isBookingAddressHostedAt(
  hostname: string,
  port: number,
  address: string,
): boolean {
  const parsedAddress = parseBookingAddress(address);
  if (
    LOCALHOST_HOSTNAMES.includes(hostname) &&
    !LOCALHOST_HOSTNAMES.includes(parsedAddress.hostname)
  ) {
    return false;
  }
  if (
    !LOCALHOST_HOSTNAMES.includes(hostname) &&
    hostname !== parsedAddress.hostname
  ) {
    return false;
  }
  if (port !== PORT_DEFAULT && parsedAddress.port !== `${port}`) return false;
  if (
    typeof parsedAddress.port === 'string' &&
    parsedAddress.port !== `${PORT_DEFAULT}`
  ) {
    return false;
  }
  return true;
}

export function normalizeBookingAddress(address: string): string {
  const parsedAddress = parseBookingAddress(address);
  if (parsedAddress.port === `${PORT_DEFAULT}`) parsedAddress.port = undefined;
  if (LOCALHOST_HOSTNAMES.includes(parsedAddress.hostname))
    parsedAddress.hostname = 'localhost';
  return serializeBookingAddress(parsedAddress);
}

export function parseBookingAddress(address: string): ParsedBookingAddress {
  const [username, hostAndPort] = address.split(USERNAME_DELIMITER);
  const parts = hostAndPort.split(PORT_DELIMITER);
  return {
    username,
    hostname: parts.at(0),
    port: parts.at(1),
  };
}

export function serializeBookingAddress(
  parsedAddress: ParsedBookingAddress,
): string {
  let serializedAddress = `${parsedAddress.username}${USERNAME_DELIMITER}${parsedAddress.hostname}`;
  if (typeof parsedAddress.port === 'string')
    serializedAddress += `${PORT_DELIMITER}${parsedAddress.port}`;
  return serializedAddress;
}

export async function validateBookingAddress(address: string): Promise<void> {
  const bookingAddress = new BookingAddressDto();
  bookingAddress.address = address;
  const bookingAddressValidationErrors = await validate(bookingAddress, {
    skipMissingProperties: true,
  });
  if (bookingAddressValidationErrors.length > 0)
    throw new BadRequestException(bookingAddressValidationErrors);
}
