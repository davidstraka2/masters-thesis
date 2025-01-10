import { publicConfig } from "@/app/config/public";

export async function getBookings(): Promise<{
  success: true;
  data: unknown;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/bookings`,
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
    return {success: false, errorMessage: `Error ${res.status}`};
  } catch (err) {
    console.error(err);
    return {success: false, errorMessage: `Error ${err}`};
  }
}
