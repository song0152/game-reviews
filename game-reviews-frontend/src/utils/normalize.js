import { toMediaUrl } from '../api/api';

export function normalizeReview(r) {
  const attrs = r?.attributes || r || {};
  return {
    id: r?.id ?? attrs?.id ?? null,  
    title: attrs?.title ?? '',
    platform: attrs?.platform ?? '',
    rating: attrs?.rating ?? '',
    excerpt: attrs?.excerpt ?? '',
    publishedAt: attrs?.publishedAt ?? '',
    cover: toMediaUrl(attrs?.coverImage?.data?.attributes?.url),
  };
}
