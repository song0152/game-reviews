export function pickFirst(obj, keys, fallback = undefined) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
      return obj[k];
    }
  }
  return fallback;
}

export function normalizeReview(rec) {
  const a = rec?.attributes ?? rec ?? {};

  const formats =
    a?.coverImage?.formats ||
    a?.image?.formats ||
    a?.cover?.formats ||
    a?.coverImage?.data?.attributes?.formats ||
    a?.image?.data?.attributes?.formats ||
    a?.cover?.data?.attributes?.formats ||
    null;

  const imageUrl =
    formats?.medium?.url ||
    formats?.large?.url ||
    formats?.small?.url ||
    a?.coverImage?.url ||
    a?.image?.url ||
    a?.cover?.url ||
    a?.coverImage?.data?.attributes?.url ||
    a?.image?.data?.attributes?.url ||
    a?.cover?.data?.attributes?.url ||
    '';

  const contentRaw = pickFirst(a, ['content', 'body', 'review', 'html'], '');

  return {
    id: rec?.id,
    docId: rec?.documentId || a?.documentId,
    title: pickFirst(a, ['title', 'name', 'gameTitle'], 'Untitled'),
    platform: pickFirst(a, ['platform', 'console', 'system'], 'Unknown'),
    rating: pickFirst(a, ['rating', 'score', 'stars'], '-'),
    excerpt: pickFirst(a, ['excerpt', 'summary', 'short'], ''),
    content: contentRaw,
    imageUrl
  };
}
