import { publicConfig } from "../../../../config/public";

export async function createItem(data: object): Promise<{
  success: true;
} | {
  success: false;
  errorMessage: string;
}> {
  const item = data as {
    name: string;
    description?: string;
    startDate: string;
    duration?: string;
    url?: string;
    location?: string;
    capacity?: number;
    bookDeadline?: string;
  };
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/inventory/items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          capacity: item.capacity,
          bookDeadline: item.bookDeadline ?? item.startDate,
          metadata: {
            name: item.name,
            startDate: item.startDate,
            duration: item.duration,
            url: item.url,
            location: item.location,
          },
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
