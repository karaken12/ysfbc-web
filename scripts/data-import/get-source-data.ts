export type SourceBookData = {
  title: string;
  author: string;
  meeting_for: string;
  "suggested-by"?: string;
  slug: string;
  "image-source": string;
  "info-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  "store-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  ptype: "books";
  "img-url": string;
};

export type SourceShortData = {
  title: string;
  author: string;
  meeting_for: string;
  slug: string;
  "image-source": string;
  "info-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  "store-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  ptype: "shorts";
  "img-url": string;
};

type SourceMeetingData = {
  date: string;
  where: string;
  facebook?: { event_id: number },
  name: string;
  book: SourceBookData;
  short: SourceShortData;
  film: {
    title: string;
    meeting_for: string;
    slug: string;
    "image-source": string;
    "info-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    "store-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    ptype: "films";
    "img-url": string;
  }
};

const fetchData = async () => {
  const serviceUrl = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

  const res = await fetch(serviceUrl);
  return res.json();
};

export const getSourceMeetings: () => Promise<Array<SourceMeetingData>> = async () => {
  return Object.values(await fetchData());
};
