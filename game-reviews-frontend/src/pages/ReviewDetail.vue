<template>
  <main class="container">
    <div v-if="loading" class="status">Loading…</div>
    <div v-else-if="!review" class="status">Review not found.</div>

    <article v-else class="detail">
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

      <div v-if="review.content" class="content">
      </div>
    </article>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getReviewById } from '../api/api';
import { normalizeReview } from '../utils/normalize';

const route = useRoute();
const loading = ref(false);
const review = ref(null);

async function load() {
  loading.value = true;
  try {
    const id = route.params.id;
    const { data } = await getReviewById(id);
    review.value = data ? normalizeReview(data) : null;
  } catch (e) {
    console.error('[detail] load error', e);
    review.value = null;
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
.hero { width: 100%; max-height: 420px; object-fit: cover; display: block; }
.title { margin: 16px 16px 10px; font-size: 28px; line-height: 1.25; }
.meta { margin: 0 16px 10px; color: #7b7b7b; display: flex; gap: 12px; font-size: 13px; }
.excerpt { margin: 0 16px 16px; color: #444; }
.content { padding: 0 16px 20px; color: #333; }
</style>
