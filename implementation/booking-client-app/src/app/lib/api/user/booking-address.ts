import { publicConfig } from "../../../config/public";

export async function createBookingAddress(address: string): Promise<{
  success: true;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/booking-address`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({address}),
      }
    );
    if (res.status === 201) return {success: true};
    if (res.status === 409) {
      return {
        success: false,
        errorMessage: `The booking address ${address} is already taken`,
      };
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

export async function getBookingAddress(): Promise<{
  success: true;
  data: unknown;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/booking-address`,
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
