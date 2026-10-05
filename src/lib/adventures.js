import { reader } from './reader.js';

// Adventures in the order set by "Story order" on the My Adventures page in Keystatic.
// Stories missing from that list follow, alphabetically, so a new story never disappears.
export async function getOrderedStories() {
  const [page, slugs] = await Promise.all([
    reader.singletons.adventuresPage.read(),
    reader.collections.adventures.list(),
  ]);
  const order = (page?.storyOrder ?? []).filter((slug, i, arr) => slug && slugs.includes(slug) && arr.indexOf(slug) === i);
  const rest = slugs.filter((slug) => !order.includes(slug)).sort();
  return Promise.all(
    [...order, ...rest].map(async (slug) => ({ slug, ...await reader.collections.adventures.read(slug) }))
  );
}
