import { getCollection } from "astro:content";

export const getPublishedPosts = async () =>
  (await getCollection("posts", ({ data }) => !data.draft)).toSorted(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
