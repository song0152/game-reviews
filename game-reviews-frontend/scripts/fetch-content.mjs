import fs from 'node:fs/promises';

const API = process.env.STRAPI_URL ?? 'https://game-reviews-cms.onrender.com';
const TOKEN = process.env.STRAPI_TOKEN ?? ''; 

async function fetchJSON(path) {
  const r = await fetch(`${API}${path}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${r.statusText}`);
  return r.json();
}

async function fetchAll(pathBase, pageSize = 100) {
  let page = 1;
  const all = [];
  while (true) {
    const qs = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const res = await fetchJSON(`${pathBase}${pathBase.includes('?') ? '&' : '?'}${qs}`);
    all.push(...(res.data ?? []));
    const { page: p, pageCount } = res.meta?.pagination ?? {};
    if (!p || p >= pageCount) break;
    page++;
  }
  return { data: all, meta: { pagination: { total: all.length } } };
}

async function main() {
  const reviews   = await fetchAll('/api/reviews?populate=*&sort=publishedAt:desc', 200);
  const platforms = await fetchAll('/api/platforms?populate=*', 200);
  const categories= await fetchAll('/api/categories?populate=*', 200);

  await fs.mkdir('public/data', { recursive: true });
  await fs.writeFile('public/data/reviews.json',   JSON.stringify(reviews),   'utf8');
  await fs.writeFile('public/data/platforms.json', JSON.stringify(platforms), 'utf8');
  await fs.writeFile('public/data/categories.json',JSON.stringify(categories),'utf8');

  console.log('✅ Static data updated in public/data/');
}

main().catch((e) => {
  console.error('❌ fetch-content failed:', e);
  process.exit(0);
});
