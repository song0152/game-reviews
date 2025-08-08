import axios from 'axios';

// Use env var; fallback to local Strapi
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export function getReviews(params = {}) {
  // include cover image
  return api.get('/api/reviews', {
    params: { populate: 'coverImage', sort: 'publishedAt:desc', ...params },
  });
}

export function getReviewById(id) {
  return api.get(`/api/reviews/${id}`, { params: { populate: 'coverImage' } });
}

export function toMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${baseURL}${path}`;
}
