import { publicConfig } from "../../../config/public";

export async function createBooking(address: string, inventoryId: string, itemId: string, formData?: object): Promise<{
  success: true;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const encodedAddress = encodeURIComponent(address);
    formData = Object.keys(formData ?? {}).length > 0 ? formData : undefined;
    const res = await fetch(
      `${publicConfig.api}/api/booking-addresses/${encodedAddress}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            id: itemId,
            inventory: {
              id: inventoryId,
            },
          },
          formData: formData,
        }),
      }
    );
    if (res.status === 201) return {success: true};
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
