import {Book, Film, Short} from "./media";

export type Meeting = {
  name: string | null;
  date: string | null;
  where: any;
  book?: Book;
  short?: Short;
  film?: Film
};
