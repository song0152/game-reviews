import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://game-reviews-cms.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

async function fetchWithFallback(apiPath, fallback) {
  try {
    const { data } = await api.get(apiPath);
    const list = Array.isArray(data?.data) ? data.data : [];
    console.log(`[api] use LIVE: ${apiPath} -> ${list.length} items`);
    return { data: list, meta: data?.meta, source: 'live' };
  } catch (e) {
    try {
      const res = await fetch(fallback, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`fallback ${fallback} ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      console.log(`[api] use CACHE: ${fallback} -> ${list.length} items`);
      return { data: list, meta: json?.meta, source: 'cache' };
    } catch (e2) {
      console.error('[api] both live & cache failed', e, e2);
      return { data: [], meta: {}, source: 'none' };
    }
  }
}

export async function getReviews(extra = {}) {
  const params = new URLSearchParams({
    fields: 'id,documentId,title,platform,rating,excerpt,publishedAt',
    populate: 'coverImage',
    sort: 'publishedAt:desc',
    'pagination[pageSize]': 100,
    ...extra,
  }).toString();
  return fetchWithFallback(`/reviews?${params}`, '/data/reviews.json');
}

export async function getReviewById(idOrDocId) {
  const isDocId = isNaN(Number(idOrDocId));
  const path = isDocId
    ? `/reviews?filters[documentId][$eq]=${encodeURIComponent(idOrDocId)}&populate=coverImage`
    : `/reviews/${idOrDocId}?populate=coverImage`;

  try {
    const { data } = await api.get(path);
    const item = isDocId ? (data?.data?.[0] ?? null) : data?.data ?? null;
    console.log('[api] detail LIVE ok', { isDocId, idOrDocId, hit: !!item });
    return { data: item };
  } catch (e) {
    try {
      const json = await fetch('/data/reviews.json').then(r => r.json());
      const list = Array.isArray(json?.data) ? json.data : [];
      const item = list.find(it =>
        String(it?.id) === String(idOrDocId) || String(it?.documentId) === String(idOrDocId)
      ) || null;
      console.log('[api] detail CACHE', { isDocId, idOrDocId, hit: !!item });
      return { data: item };
    } catch (e2) {
      console.error('[api detail] live & cache failed', e, e2);
      return { data: null };
    }
  }
}

export function toMediaUrl(path) {
  if (!path) return '';
  if (String(path).startsWith('http')) return path;
  return `${API_URL}${path}`;
}
