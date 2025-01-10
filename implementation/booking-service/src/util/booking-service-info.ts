import { isBase64, isJSON, isSemVer } from 'class-validator';

export function validateBookingServiceCompatibility(
  bookingServiceInfo: string,
): boolean {
  try {
    if (!isBase64(bookingServiceInfo)) return false;
    const infoJSON = Buffer.from(bookingServiceInfo, 'base64').toString(
      'utf-8',
    );
    if (!isJSON(infoJSON)) return false;
    const info = JSON.parse(infoJSON);
    if (!('version' in info) || typeof info.version !== 'string') return false;
    if (!isSemVer(info.version)) return false;
    if (/([0-9]+?)\./.exec(info.version)[1] !== '1') return false;
    return true;
  } catch {
    return false;
  }
}

export function getBookingServiceInfo() {
  return Buffer.from(
    JSON.stringify({
      version: '1.0.0',
    }),
  ).toString('base64');
}
