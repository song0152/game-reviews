import { toMediaUrl } from '../api/api';

export function normalizeReview(input) {
  const src = input?.attributes ? { id: input.id, documentId: input.documentId, ...input.attributes } : (input || {});

  const img = src?.coverImage?.data?.attributes || src?.coverImage?.attributes || null;
  const rawUrl =
    img?.url ||
    img?.formats?.medium?.url ||
    img?.formats?.large?.url ||
    img?.formats?.thumbnail?.url ||
    null;

  return {
    id: src.id ?? null,
    documentId: src.documentId ?? null,
    title: src.title ?? '',
    platform: src.platform ?? '',
    rating: src.rating ?? '',
    excerpt: src.excerpt ?? '',
    publishedAt: src.publishedAt ?? null,
    cover: rawUrl ? toMediaUrl(rawUrl) : '',
  };
}
