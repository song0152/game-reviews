import { toMediaUrl } from '../api/api';

export function normalizeReview(item = {}) {
  const attrs = item.attributes ? item.attributes : item;

  const id =
    item.documentId ||
    attrs.documentId ||
    item.id ||
    attrs.id;

  const img =
    attrs?.coverImage?.data?.attributes?.url || 
    attrs?.coverImage?.url ||                   
    item?.coverImage?.data?.attributes?.url || 
    item?.coverImage?.url ||
    attrs?.cover?.url;                        

  return {
    id,              
    documentId: id,
    title: attrs.title ?? '',
    excerpt: attrs.excerpt ?? '',
    platform: attrs.platform ?? '',
    rating: attrs.rating ?? '',
    publishedAt: attrs.publishedAt ?? item.publishedAt ?? '',
    cover: toMediaUrl(img),
  };
}
