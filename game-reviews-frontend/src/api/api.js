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
    populate: 'coverImage',
    sort: 'publishedAt:desc',
    ...params,
  }).toString();
  const res = await fetchWithFallback(`/reviews?${search}`, '/data/reviews.json');
  return res.data;
}

export async function getReviewById(id) {
  try {
    const { data } = await api.get(`/reviews/${id}`, {
      params: { populate: 'coverImage' },
    });
    console.log('[api] use LIVE detail', id);
    return data?.data;
  } catch (e) {
    const res = await fetch('/data/reviews.json').then((r) => r.json());
    const item = (res?.data || []).find((it) => String(it.id) === String(id));
    if (item) {
      console.log('[api] use CACHE detail', id);
      return item;
    }
    throw e;
  }
}

export function toMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}
