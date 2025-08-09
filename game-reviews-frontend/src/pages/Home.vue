<template>
  <main class="container">
    <h1>Our Game Reviews</h1>


    <div v-if="loading" class="status">Loading reviews...</div>
    <div v-else-if="filtered.length === 0" class="status">No reviews found.</div>

    <section class="grid">
      <ReviewCard v-for="r in filtered" :key="r.id" :review="r" />
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getReviews } from '../api/api';
import ReviewCard from '../components/ReviewCard.vue';
import { normalizeReview } from '../utils/normalize';

const route = useRoute();

const raw = ref([]);
const reviews = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await getReviews();

    const list = Array.isArray(res) ? res : (res?.data ?? []);
    raw.value = Array.isArray(list) ? list : [];

    reviews.value = raw.value
      .map((r) => {
        try {
          return normalizeReview(r);
        } catch (e) {
          console.error('[normalize] fail for', r, e);
          return null;
        }
      })
      .filter(Boolean);

    console.log('[home] loaded:', reviews.value.length, 'items');
  } catch (e) {
    console.error('[home] load error', e);
    raw.value = [];
    reviews.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const filtered = computed(() => {
  const list = Array.isArray(reviews.value) ? reviews.value : [];

  const q = (route.query.q?.toString() || '').toLowerCase();
  const plat = route.params.platform ? route.params.platform.toString().toLowerCase() : 'all';

  return list.filter((r) => {
    const title = r?.title ?? '';
    const platform = r?.platform ?? '';
    const rating = r?.rating ?? '';

    const hitQ =
      !q ||
      [title, platform, String(rating)]
        .some(v => String(v || '').toLowerCase().includes(q));

    const hitP =
      plat === 'all' || !plat
        ? true
        : String(platform).toLowerCase().includes(plat);

    return hitQ && hitP;
  });
});

watch(() => [route.query.q, route.params.platform], () => {}, { flush: 'post' });
</script>


<style scoped>
.container { max-width: var(--container); margin: 0 auto; padding: 20px 16px; }
.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--gap);
}
@media (min-width: 640px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px){ .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 360px) { .grid { gap: 12px; } }
.status { color: var(--muted); margin: 16px 0; }
</style>

