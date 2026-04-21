import { getCollection } from "astro:content";

export const getPublishedPosts = async () =>
  (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
