import { publicConfig } from "../../../config/public";
import { inventoryFormSchema } from "../../schemas/inventoryFormSchema";
import { itemMetadataSchema } from "../../schemas/itemMetadataSchema";

export async function createInventory(data: object): Promise<{
  success: true;
} | {
  success: false;
  errorMessage: string;
}> {
  const inventory = data as {
    name: string;
    description?: string;
    url?: string;
    contact?: {
      email?: string;
      telephone?: string;
      address?: string;
      openingHours?: string;
    };
  };
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/inventory`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          permissionMode: 'ban',
          metadata: {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: inventory.name,
            description: inventory.description,
            url: inventory.url,
            email: inventory.contact?.email,
            telephone: inventory.contact?.telephone,
            address: inventory.contact?.address,
            openingHours: inventory.contact?.openingHours,
          },
          form: inventoryFormSchema,
          itemType: 'https://schema.org/Event',
          itemMetadataSchema: itemMetadataSchema,
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

export async function getInventory(): Promise<{
  success: true;
  data: unknown;
} | {
  success: false;
  errorMessage: string;
}> {
  try {
    const res = await fetch(
      `${publicConfig.api}/api/user/inventory`,
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
    if (res.status === 400) {
      return {
        success: false,
        errorMessage: `You have no inventory`
      };
    }
    return {success: false, errorMessage: `Error ${res.status}`};
  } catch (err) {
    console.error(err);
    return {success: false, errorMessage: `Error ${err}`};
  }
}
