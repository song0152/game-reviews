import { toMediaUrl } from '../api/api';

export function normalizeReview(item) {
  const a = item?.attributes ?? item ?? {};

  const coverUrl =
    a?.coverImage?.data?.attributes?.url ??
    a?.coverImage?.url ??
    a?.cover ??
    '';

  return {
    id: item?.id ?? a?.id ?? '',
    title: a?.title ?? '',
    platform: a?.platform ?? '',
    rating: a?.rating ?? '',
    excerpt: a?.excerpt ?? '',
    content: a?.content ?? null,  
    cover: coverUrl ? toMediaUrl(coverUrl) : '',
    publishedAt: a?.publishedAt ?? '',
  };
}
