# Game Reviews – Frontend (Vue 3 + Vite)

A responsive game reviews website that consumes data from a Strapi Headless CMS.  
Built with **Vue 3 + Vite + Vue Router + Axios** and deployed to **Netlify**.

## Features

- Fetch reviews from Strapi via REST API
- List view with cover image, title, platform, excerpt
- **Platform filters** in the top nav (PC / PS5 / PS4 / Xbox / Nintendo Switch / Mobile)
- **Search in the navbar** (works together with platform filter)
- **Detail page** with hero image and full content
- **Color-coded rating badge** (green/yellow/red)
- Fully **responsive** (mobile-first; scrollable platform menu on small screens)

## Tech Stack

- Vue 3, Vite, Vue Router
- Axios
- Vanilla CSS (no framework) with CSS variables

## Environment Variables

Create a `.env` for local dev and a `.env.production` for production:

```env
# .env (local)
VITE_API_URL=http://localhost:1337

# .env.production (production)
VITE_API_URL=https://YOUR-STRAPI-DOMAIN
Only variables prefixed with VITE_ are exposed to the client.

Project Setup
bash
Copy
Edit
npm install
npm run dev
Dev server: http://localhost:5173

The app expects Strapi to be running and accessible at VITE_API_URL.

Build & Preview
bash
Copy
Edit
npm run build
npm run preview
Folder Structure (key parts)
arduino
Copy
Edit
src/
  api/
    api.js               # axios instance + API helpers
  components/
    NavBar.vue
    ReviewCard.vue
    BlocksRenderer.vue   # render Strapi v5 Blocks content
  pages/
    Home.vue
    ReviewDetail.vue
  router/
    index.js
  utils/
    normalize.js         # normalize v4/v5 Strapi responses
  styles.css             # global styles (responsive helpers)
Strapi Compatibility
Strapi v5: uses documentId for detail route.

Strapi v4: normalize.js and API helpers are backward-compatible.

Deployment (Netlify)
Push this repo to GitHub.

In Netlify → New site from Git, select the repo.

Build command: npm run build
Publish directory: dist

Add environment variable in Site settings → Build & deploy → Environment:

VITE_API_URL=https://YOUR-STRAPI-DOMAIN

Deploy and share the public URL.

Live URL
Frontend (Netlify): <YOUR_NETLIFY_URL>

Mapping to Requirements
Headless CMS with REST API (Strapi) → ✅ consumed via Axios

List of ≥10 reviews → ✅

Search functionality → ✅ (navbar)

Clicking a review shows full page → ✅

Site-wide navigation → ✅ (platform filters)

Responsive design → ✅ (mobile-first)

Published to a static host → ✅ (Netlify)