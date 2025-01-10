import { publicConfig } from "../../config/public";

const PORT_DELIMITER = ':';
const PORT_MAX_VALUE = 65535;
const URL_SCHEME = 'web+booking://';
const USERNAME_DELIMITER = '@';
const USERNAME_MAX_LENGTH = 64;
const USERNAME_PATTERN = /^[0-9A-Za-z._-]+?$/;

export function urlToAddress(url: string): string {
  if (url.startsWith(URL_SCHEME)) {
    url = url
      .slice(URL_SCHEME.length)
      .replace('~', '@');
    if (url.indexOf('/') >= 0)
      url = url.slice(0, url.indexOf('/'));
    if (url.indexOf('?') >= 0)
      url = url.slice(0, url.indexOf('?'));
    if (url.indexOf('#') >= 0)
      url = url.slice(0, url.indexOf('#'));
  }
  return url;
}

export function usernameToAddress(username: string): string {
  return `${username}@${publicConfig.bookingAddressAt}`;
}

export function usernameToEncodedAddress(username: string): string {
  return encodeURIComponent(usernameToAddress(username));
}

export function validateAddress(address: string): {
  isValid: true;
} | {
  isValid: false;
  errorMessage: string;
} {
  let parts = address.split(USERNAME_DELIMITER);
  if (parts.length !== 2) return {
    isValid: false,
    errorMessage: 'Address must be in format username@example.com (either no or too many "@" characters found in address)',
  };
  const [username, host] = parts;
  if (username.length > USERNAME_MAX_LENGTH) return {
    isValid: false,
    errorMessage: `Address username must be at most ${USERNAME_MAX_LENGTH} characters long (is ${username.length})`,
  };
  if (!USERNAME_PATTERN.test(username)) return {
    isValid: false,
    errorMessage: `Address username can contain only Arabic numerals (0-9), 26 English letters regardless of case (A-Z, a-z),` +
        ` and the following special characters: dot ".", underscore "_", and hyphen "-"`,
  };
  parts = host.split(PORT_DELIMITER);
  if (parts.length > 2) return {
    isValid: false,
    errorMessage: 'Address can contain at most one port delimiter ":"',
  };
  if (parts.length === 2) {
    const [_, port] = parts;
    if (!/^[0-9]+$/.test(port)) return {
      isValid: false,
      errorMessage: 'Address port must only contain digits',
    };
    const portNumber = parseInt(port, 10);
    if (portNumber < 0) return {
      isValid: false,
      errorMessage: 'Address port number must be non-negative',
    };
    if (portNumber > PORT_MAX_VALUE) return {
      isValid: false,
      errorMessage: `Address port must be at most ${PORT_MAX_VALUE} (is ${portNumber})`,
    };
  }
  const [hostname] = parts;
  try {
    const url = new URL(`http://${hostname}`);
    if (url.hostname !== hostname)
      throw new Error('');
  } catch {
    return {
      isValid: false,
      errorMessage: 'Address hostname must be a domain or an IP address',
    };
  }
  return {isValid: true};
}

export function validateUsername(username: string): {
  isValid: true;
} | {
  isValid: false;
  errorMessage: string;
} {
  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Username must be at most ${USERNAME_MAX_LENGTH} characters long (is ${username.length})`,
    };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return {
      isValid: false,
      errorMessage: `Username can contain only Arabic numerals (0-9), 26 English letters regardless of case (A-Z, a-z),` +
        ` and the following special characters: dot ".", underscore "_", and hyphen "-"`,
    }
  }
  return {isValid: true};
}
