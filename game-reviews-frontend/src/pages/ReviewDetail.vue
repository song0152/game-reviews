<template>
  <main class="container">
    <div v-if="loading" class="status">Loading…</div>
    <div v-else-if="!review" class="status">Review not found.</div>

    <article v-else class="detail">
      <RouterLink class="back" :to="{ name: 'home' }">← Back</RouterLink>

      <img v-if="review.cover" :src="review.cover" alt="" class="hero" />
      <h1 class="title">{{ review.title }}</h1>

      <div class="meta">
        <span v-if="review.platform">{{ review.platform }}</span>
        <span v-if="review.rating">⭐ {{ review.rating }}</span>
        <span v-if="review.publishedAt" class="time">
          {{ new Date(review.publishedAt).toLocaleDateString() }}
        </span>
      </div>

      <p class="excerpt">{{ review.excerpt }}</p>

      <div v-if="review.content" class="content" v-html="rendered"></div>
    </article>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { getReviewById } from '../api/api';
import { normalizeReview } from '../utils/normalize';

const route = useRoute();
const loading = ref(false);
const review = ref(null);

function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return '';
  const esc = (s='') => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const run = (nodes=[]) => nodes.map(n => n.text || '').join('');
  return blocks.map(b => {
    const txt = esc(run(b.children || []));
    if (b.type?.startsWith('heading')) return `<h2>${txt}</h2>`;
    if (b.type === 'paragraph') return `<p>${txt}</p>`;
    return `<p>${txt}</p>`;
  }).join('');
}

const rendered = computed(() => blocksToHtml(review.value?.content));

async function load() {
  loading.value = true;
  try {
    const id = route.params.id;  
    const { data } = await getReviewById(id);
    review.value = data ? normalizeReview(data) : null;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
.status { color: #777; margin: 24px 0; }
.detail { background: #fff; border-radius: 16px; box-shadow: 0 6px 22px rgba(0,0,0,.06); overflow: hidden; }
.back { display: inline-block; margin: 10px 16px 0; color: #666; text-decoration: none; }
.hero { width: 100%; max-height: 420px; object-fit: cover; display: block; }
.title { margin: 16px 16px 10px; font-size: 28px; line-height: 1.25; }
.meta { margin: 0 16px 10px; color: #7b7b7b; display: flex; gap: 12px; font-size: 13px; }
.excerpt { margin: 0 16px 16px; color: #444; }
.content :deep(p) { margin: 0 16px 12px; line-height: 1.75; color: #333; }
.content :deep(h2) { margin: 12px 16px; font-size: 20px; }
</style>
