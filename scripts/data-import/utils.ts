
export type Localised<T> = { "en-GB": T };

export type ContentfulEntryLink = {
  sys: {
    type: "Link";
    linkType: "Entry";
    id: string;
  }
}

export const localise = <T>(entry: T): Localised<T> => ({"en-GB": entry})

export const createEntryLink = (id: string): ContentfulEntryLink => ({sys: {type: 'Link', linkType: 'Entry', id: id}});

export const deepEqual = (lhs: object, rhs: object) => {
  // A hack to check for deep equality
  return JSON.stringify(lhs) === JSON.stringify(rhs);
};
