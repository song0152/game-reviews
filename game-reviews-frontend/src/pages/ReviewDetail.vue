<template>
  <main class="container">
    <router-link to="/" class="back">← Back</router-link>

    <div v-if="loading" class="status">Loading...</div>
    <div v-else-if="!review" class="status">Not found.</div>

    <article v-else class="article">
  <img v-if="imageUrl" :src="imageUrl" :alt="review.title" class="hero" />
  <h1>{{ review.title }}</h1>
  <p class="meta">
    <span>Platform: {{ review.platform }}</span>
    <span>Rating: {{ review.rating }}/10</span>
  </p>

  <BlocksRenderer v-if="Array.isArray(review.content)" :blocks="review.content" />

  <div v-else class="content prose" v-html="review.content"></div>
</article>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getReviewById, toMediaUrl } from '../api/api';
import { normalizeReview } from '../utils/normalize';
import BlocksRenderer from '../components/BlocksRenderer.vue';

const route = useRoute();
const loading = ref(false);
const review = ref(null);

const imageUrl = computed(() =>
  review.value?.imageUrl ? toMediaUrl(review.value.imageUrl) : ''
);

onMounted(async () => {
  loading.value = true;
  try {
    // In Strapi v5, this should be the documentId (string) we passed from the card
    const idOrDocId = route.params.id;
    const { data } = await getReviewById(idOrDocId);
    const rec = data?.data || null;
    review.value = rec ? normalizeReview(rec) : null;
  } catch (e) {
    console.error(e);
    review.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@media (max-width: 768px) { .hero { max-height: 300px; } }
.container { max-width: 800px; margin: 0 auto; padding: 20px 16px; }
.back { display: inline-block; margin-bottom: 12px; text-decoration: none; color: #6c4ad0; }
.status { color: #666; margin: 16px 0; }

.hero {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
}
.meta { color: #666; display: flex; gap: 12px; margin: 8px 0 16px; }
.content :deep(*) { max-width: 100%; }
.content :deep(img) { width: 100%; height: auto; border-radius: 12px; object-fit: contain; }
</style>
