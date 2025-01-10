import { publicConfig } from "../../../config/public";

export async function getBookingAddressInventory(address: string): Promise<{
  success: true;
  data: unknown;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const res = await fetch(
      `${publicConfig.api}/api/booking-addresses/${encodedAddress}/inventory`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      return {success: true, data};
    }
    if (res.headers.get("content-type")?.includes("application/json")) {
      const json = await res.json();
      return {
        success: false,
        errorMessage: `Error ${res.status}: ${json.message}`,
      };
    }
    return {success: false, errorMessage: `Error ${res.status}`};
  } catch (err) {
    console.error(err);
    return {success: false, errorMessage: `Error ${err}`};
  }
}
