import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://game-reviews-cms.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
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

export async function getReviewByIdOrDoc(idOrDoc) {
  const key = String(idOrDoc || '');
  const isNumeric = /^\d+$/.test(key);

  try {
    if (isNumeric) {
      const { data } = await api.get(`/reviews/${key}`, { params: { populate: 'coverImage' } });
      return { data: data?.data ?? null };
    }
    const { data } = await api.get('/reviews', {
      params: {
        populate: 'coverImage',
        'filters[documentId][$eq]': key,
        'pagination[pageSize]': 1,
      },
    });
    const item = Array.isArray(data?.data) ? data.data[0] : null;
    return { data: item ?? null };
  } catch (e) {
    try {
      const json = await fetch('/data/reviews.json').then(r => r.json());
      const list = Array.isArray(json?.data) ? json.data : [];
      const found = list.find(it =>
        isNumeric ? String(it?.id) === key : String(it?.documentId || it?.attributes?.documentId) === key
      );
      return { data: found ?? null };
    } catch (e2) {
      console.error('[api detail] live & cache failed', e, e2);
      return { data: null };
    }
  }
}

export function toMediaUrl(path) {
  if (!path) return '';
  const p = String(path);
  if (p.startsWith('http')) return p;
  return `${API_URL}${p}`;
}
