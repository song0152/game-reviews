import { toMediaUrl } from '../api/api';

export function normalizeReview(raw) {
  if (!raw) return null;
  const row = raw.attributes ? raw : { attributes: raw, id: raw.id, documentId: raw.documentId };

  const a = row.attributes || {};
  const cover = a.coverImage?.data?.attributes?.url
    || a.coverImage?.url
    || a.cover?.url;

  return {
    id: row.documentId || row.id,
    legacyId: row.id,
    title: a.title || '',
    platform: a.platform || '',
    rating: a.rating ?? null,
    excerpt: a.excerpt || '',
    publishedAt: a.publishedAt || null,
    cover: toMediaUrl(cover || ''),
    content: a.content || null,
  };
}
