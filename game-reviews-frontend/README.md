# Game Reviews Frontend

This is the frontend of the **Game Reviews** project, built with **Vue 3 + Vite**.  
It displays a list of video game reviews, with search and platform filtering, and detailed review pages.

The frontend fetches review data from a Strapi CMS hosted on Render.  
If the Strapi API is unavailable, the site falls back to using cached static JSON data (`/data/reviews.json`).

---

## 🚀 Live Demo

**Frontend (Netlify)**: *(Add your deployed Netlify URL here)*  
**Backend (Strapi on Render)**: [https://game-reviews-cms.onrender.com](https://game-reviews-cms.onrender.com)

---

## 🛠 Tech Stack

- **Frontend Framework**: Vue 3
- **Build Tool**: Vite
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS (if applicable) / Custom CSS
- **CMS**: Strapi (hosted on Render)

---

## 📂 Project Structure

game-reviews-frontend/
├── public/ # Static assets
│ └── data/ # Cached JSON for fallback
├── scripts/ # Fetch and cache content scripts
├── src/
│ ├── api/ # API helpers
│ ├── assets/ # Images, icons
│ ├── components/ # Reusable Vue components
│ ├── pages/ # Main pages (Home, ReviewDetail)
│ ├── router/ # Vue Router configuration
│ ├── styles/ # CSS files
│ └── utils/ # Helper functions (e.g., normalizeReview)
├── .env # Environment variables
├── package.json
├── vite.config.js
└── README.md
