import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

export function getReviews(params = {}) {
  return api.get('/reviews', {
    params: { populate: 'coverImage', sort: 'publishedAt:desc', ...params },
  })
}

export function getReviewById(id) {
  return api.get(`/reviews/${id}`, {
    params: { populate: 'coverImage' },
  })
}

export function toMediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
