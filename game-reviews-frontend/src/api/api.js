import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://game-reviews-cms.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, 
});

/**
 * 在线优先，失败则回退到本地静态 JSON
 * @param {string} apiPath    - 线上 API 路径（/reviews?...）
 * @param {string} fallback   - 本地 JSON 路径（/data/reviews.json）
 * @returns {Promise<any>}    - 返回 JSON（与 Strapi 响应一致）
 */
async function fetchWithFallback(apiPath, fallback) {
  try {
    const { data } = await api.get(apiPath);
    return data; // { data, meta }
  } catch (err) {
    try {
      const res = await fetch(fallback, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Fallback ${fallback} ${res.status}`);
      return await res.json();
    } catch (fallbackErr) {
      throw err;
    }
  }
}


export function getReviews(params = {}) {
  const search = new URLSearchParams({
    populate: 'coverImage',
    sort: 'publishedAt:desc',
    ...params,
  }).toString();

  return fetchWithFallback(`/reviews?${search}`, '/data/reviews.json');
}


export async function getReviewById(id) {
  try {
    const { data } = await api.get(`/reviews/${id}`, {
      params: { populate: 'coverImage' },
    });
    return data; // { data, meta? }
  } catch (err) {
    const list = await fetch('/data/reviews.json').then((r) => r.json());
    const found = list?.data?.find((it) => String(it.id) === String(id));
    if (found) return { data: found, meta: list.meta };
    throw err;
  }
}

export function toMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}
