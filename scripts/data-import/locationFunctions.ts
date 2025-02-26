import {PlainClientAPI} from "contentful-management";

export const locationFunctions = (client: PlainClientAPI) => {
  const locationCache = new Map<string, any>()

  async function createOrFetchLocation(where: string) {
    console.log(`Fetching location data for ${where}`)
    const entries = await client.entry.getMany({
      query: {
        content_type: 'location',
        'fields.name': where,
        limit: 2,
      },
    })

    if (entries.total > 1) {
      throw new Error(`Too many entries for ${where} (${entries.total})`)
    }

    if (entries.total != 0) {
      return entries.items[0]
    }

    console.log(`Creating location ${where}`)
    return client.entry.create(
      {contentTypeId: 'location'},
      {fields: {name: {"en-GB": where}}}
    )
  }

  const getContentfulLocation = async (where: string) => {
    if (!locationCache.has(where)) {
      locationCache.set(where, await createOrFetchLocation(where))
    }

    return locationCache.get(where);
  };

  return {createOrFetchLocation, getContentfulLocation};
};
