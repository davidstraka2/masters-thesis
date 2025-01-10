import { publicConfig } from "@/app/config/public";

export async function getItemBookings(itemId: string): Promise<{
  success: true;
  data: any;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/inventory/items/${itemId}/bookings`,
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
    if (res.status === 404)
      return {success: false, errorMessage: 'Could not find requested item'};
    return {success: false, errorMessage: `Error ${res.status}`};
  } catch (err) {
    console.error(err);
    return {success: false, errorMessage: `Error ${err}`};
  }
}
