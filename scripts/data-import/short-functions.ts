import {ContentfulEntryLink, createEntryLink, deepEqual, localise, Localised} from "./utils";
import {EntryProps, PlainClientAPI} from "contentful-management";
import {SourceShortData} from "./get-source-data";
import {ContentfulMeeting} from "./meeting-functions";

type ContentfulShort = {
  title: Localised<string>;
  author: Localised<string>;
  slug: Localised<string>;
  infoLinks?: Localised<Array<ContentfulEntryLink>>;
  storeLinks?: Localised<object | object[] | undefined>;
};

export const shortFunctions = (client: PlainClientAPI) => {
  const getShortFields = (shortData: SourceShortData): ContentfulShort => {
    const hasStoreLinks = shortData["store-links"] && shortData["store-links"].length > 0;

    return ({
      title: localise(shortData.title),
      author: localise(shortData.author),
      slug: localise(shortData.slug),
      ...(hasStoreLinks ? {storeLinks: localise(shortData["store-links"])} : {}),
    });
  };

  const updateInfoLinks = async (shortEntry: EntryProps<ContentfulShort>, shortData: SourceShortData): Promise<EntryProps<ContentfulShort>> => {
    const existingLinks = (shortEntry.fields.infoLinks?.['en-GB'] ?? []).map(entry => entry.sys.id)
    const linkEntries = []
    for (const linkId of existingLinks) {
      const entry = await client.entry.get({entryId: linkId})
      linkEntries.push(entry)
    }
    const infoLinkData = shortData["info-links"] ?? [];

    if (deepEqual(
      linkEntries.map(entry => [entry.fields.class['en-GB'], entry.fields.url['en-GB']]),
      infoLinkData.map(entry => [entry.class, entry.url])
    )) {
      return shortEntry
    }

    console.log(`Updating info links for ${shortData.title}`);

    if (linkEntries.length == 0) {
      // create new entries
      const infoLinkRefs = []
      for (const data of infoLinkData) {
        console.log(`Creating ${data.class} info link`)
        const newInfoLinkEntry = await client.entry.create({contentTypeId: 'infoLink'}, {
          fields: {
            "class": localise(data.class),
            "url": localise(data.url),
          }
        })
        infoLinkRefs.push(createEntryLink(newInfoLinkEntry.sys.id));
      }
      // add entries to shortEntry
      return await client.entry.update<ContentfulShort>({entryId: shortEntry.sys.id},
        {
          ...(shortEntry),
          fields: {
            ...shortEntry.fields,
            infoLinks: localise(infoLinkRefs),
          }
        }
      )
    } else if (linkEntries.length == infoLinkData.length) {
      // update existing entries
      const zipped = linkEntries.map((entry, i) => ({entry, data: infoLinkData[i]}))
      for (const {entry, data} of zipped) {
        const fields = {
          "class": localise(data.class),
          "url": localise(data.url),
        };
        if (deepEqual(entry.fields, fields)) {
          continue;
        }
        console.log(`Updating ${data.class} info link`)
        await client.entry.update(
          {entryId: entry.sys.id},
          {
            ...entry,
            fields,
          }
        );
      }
      return shortEntry;
    } else {
      throw new Error(`Info links for ${shortData.title} require manual intervention (${infoLinkData.length} expected; ${linkEntries.length} found)`)
    }
  };

  const createOrUpdateShort = async (meetingEntry: EntryProps<ContentfulMeeting>, shortData: SourceShortData): Promise<EntryProps<ContentfulShort>> => {
    if (meetingEntry.fields.short) {
      const shortEntryId = meetingEntry.fields.short['en-GB'].sys.id;
      const shortEntry = await updateShortEntry(shortEntryId, shortData);
      return await updateInfoLinks(shortEntry, shortData)
    } else {
      const shortEntry = await createShortEntry(shortData);
      return await updateInfoLinks(shortEntry, shortData)
    }
  };

  const createShortEntry = async (shortData: SourceShortData): Promise<EntryProps<ContentfulShort>> => {
    const fields = getShortFields(shortData);
    console.log(`Creating short ${fields.title["en-GB"]}`)
    return client.entry.create<ContentfulShort>(
      {contentTypeId: 'short'},
      {
        fields,
      }
    )
  };

  const updateShortEntry = async (entryId: string, shortData: SourceShortData): Promise<EntryProps<ContentfulShort>> => {
    const entry = await client.entry.get<ContentfulShort>({entryId})
    const fields = {
      ...entry.fields,
      ...(getShortFields(shortData)),
    };

    if (deepEqual(entry.fields, fields)) {
      return entry
    }

    console.log(`Updating short ${entry.fields.title["en-GB"]}`)
    return client.entry.update<ContentfulShort>(
      {entryId: entry.sys.id},
      {
        ...entry,
        fields,
      }
    )
  };

  return {createOrUpdateShort};
};