import {ContentfulEntryLink, createEntryLink, deepEqual, localise, Localised} from "./utils";
import {EntryProps, PlainClientAPI} from "contentful-management";
import {SourceFilmData} from "./get-source-data";
import {ContentfulMeeting} from "./meeting-functions";

type ContentfulFilm = {
  title: Localised<string>;
  slug: Localised<string>;
  infoLinks?: Localised<Array<ContentfulEntryLink>>;
  storeLinks?: Localised<object | object[] | undefined>;
};

export const filmFunctions = (client: PlainClientAPI) => {
  const getFilmFields = (filmData: SourceFilmData): ContentfulFilm => {
    const hasStoreLinks = filmData["store-links"] && filmData["store-links"].length > 0;

    return ({
      title: localise(filmData.title),
      slug: localise(filmData.slug),
      ...(hasStoreLinks ? {storeLinks: localise(filmData["store-links"])} : {}),
    });
  };

  const updateInfoLinks = async (filmEntry: EntryProps<ContentfulFilm>, filmData: SourceFilmData): Promise<EntryProps<ContentfulFilm>> => {
    const existingLinks = (filmEntry.fields.infoLinks?.['en-GB'] ?? []).map(entry => entry.sys.id)
    const linkEntries = []
    for (const linkId of existingLinks) {
      const entry = await client.entry.get({entryId: linkId})
      linkEntries.push(entry)
    }
    const infoLinkData = filmData["info-links"] ?? [];

    if (deepEqual(
      linkEntries.map(entry => [entry.fields.class['en-GB'], entry.fields.url['en-GB']]),
      infoLinkData.map(entry => [entry.class, entry.url])
    )) {
      return filmEntry
    }

    console.log(`Updating info links for ${filmData.title}`);

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
      // add entries to filmEntry
      return await client.entry.update<ContentfulFilm>({entryId: filmEntry.sys.id},
        {
          ...(filmEntry),
          fields: {
            ...filmEntry.fields,
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
      return filmEntry;
    } else {
      throw new Error(`Info links for ${filmData.title} require manual intervention (${infoLinkData.length} expected; ${linkEntries.length} found)`)
    }
  };

  const createOrUpdateFilm = async (meetingEntry: EntryProps<ContentfulMeeting>, filmData: SourceFilmData): Promise<EntryProps<ContentfulFilm>> => {
    if (meetingEntry.fields.film) {
      const filmEntryId = meetingEntry.fields.film['en-GB'].sys.id;
      const filmEntry = await updateFilmEntry(filmEntryId, filmData);
      return await updateInfoLinks(filmEntry, filmData)
    } else {
      const filmEntry = await createFilmEntry(filmData);
      return await updateInfoLinks(filmEntry, filmData)
    }
  };

  const createFilmEntry = async (filmData: SourceFilmData): Promise<EntryProps<ContentfulFilm>> => {
    const fields = getFilmFields(filmData);
    console.log(`Creating film ${fields.title["en-GB"]}`)
    return client.entry.create<ContentfulFilm>(
      {contentTypeId: 'film'},
      {
        fields,
      }
    )
  };

  const updateFilmEntry = async (entryId: string, filmData: SourceFilmData): Promise<EntryProps<ContentfulFilm>> => {
    const entry = await client.entry.get<ContentfulFilm>({entryId})
    const fields = {
      ...entry.fields,
      ...(getFilmFields(filmData)),
    };

    if (deepEqual(entry.fields, fields)) {
      return entry
    }

    console.log(`Updating film ${entry.fields.title["en-GB"]}`)
    return client.entry.update<ContentfulFilm>(
      {entryId: entry.sys.id},
      {
        ...entry,
        fields,
      }
    )
  };

  return {createOrUpdateFilm: createOrUpdateFilm};
};