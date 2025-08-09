import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://game-reviews-cms.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

export function toMediaUrl(path) {
  if (!path) return '';
  if (String(path).startsWith('http')) return path;
  return `${API_URL}${path}`;
}

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

export async function getReviews(params = {}) {
  const search = new URLSearchParams({
    fields: 'id,documentId',
    populate: 'coverImage',
    sort: 'publishedAt:desc',
    'pagination[pageSize]': 100,
    ...params,
  }).toString();

  return fetchWithFallback(`/reviews?${search}`, '/data/reviews.json');
}

export async function getReviewById(documentId) {
  try {
    const { data } = await api.get('/reviews', {
      params: {
        populate: 'coverImage',
        'filters[documentId][$eq]': documentId,
        'pagination[pageSize]': 1,
      },
      paramsSerializer: (p) => new URLSearchParams(p).toString(),
    });

    const item = Array.isArray(data?.data) ? data.data[0] : null;

    if (!item && /^\d+$/.test(String(documentId))) {
      const { data: byNumeric } = await api.get(`/reviews/${documentId}`, {
        params: { populate: 'coverImage' },
      });
      return { data: byNumeric?.data ?? null };
    }

    return { data: item ?? null };
  } catch (e) {
    try {
      const json = await fetch('/data/reviews.json').then((r) => r.json());
      const list = Array.isArray(json?.data) ? json.data : [];
      const item =
        list.find((it) => String(it?.documentId) === String(documentId)) ||
        list.find((it) => String(it?.id) === String(documentId));
      return { data: item ?? null };
    } catch (e2) {
      console.error('[api detail] live & cache failed', e, e2);
      return { data: null };
    }
  }
}
