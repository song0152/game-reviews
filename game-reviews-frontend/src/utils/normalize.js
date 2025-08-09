import { toMediaUrl } from '../api/api';

export function normalizeReview(item) {
  const a = item?.attributes ?? {};
  const coverUrl = a?.coverImage?.data?.attributes?.url ?? '';

  return {
    id: item?.id ?? '',
    title: a?.title ?? '',
    excerpt: a?.excerpt ?? '',
    rating: a?.rating ?? '',
    platform: a?.platform ?? '',
    publishedAt: a?.publishedAt ?? '',
    cover: coverUrl ? toMediaUrl(coverUrl) : '',
  };
}
