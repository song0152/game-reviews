<template>
  <main class="container">
    <h1>Our Game Reviews</h1>

    <div v-if="loading" class="skeletons">
      <div class="sk"></div>
      <div class="sk"></div>
    </div>

    <div v-else-if="filtered.length === 0" class="status">No reviews found.</div>

    <section v-else class="grid">
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
    const list = Array.isArray(res?.data) ? res.data : [];
    raw.value = list;
    reviews.value = list.map(normalizeReview).filter(Boolean);
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
  const list = reviews.value || [];
  const q = (route.query.q?.toString() || '').toLowerCase();
  const plat = route.params.platform ? route.params.platform.toString().toLowerCase() : 'all';

  return list.filter((r) => {
    const hitQ = !q || [r.title, r.platform, String(r.rating)]
      .some(v => String(v || '').toLowerCase().includes(q));

    const hitP = plat === 'all' || !plat
      ? true
      : String(r.platform || '').toLowerCase().includes(plat);

    return hitQ && hitP;
  });
});

watch(() => [route.query.q, route.params.platform], () => {}, { flush: 'post' });
</script>

<style scoped>
.container { max-width: var(--container); margin: 0 auto; padding: 20px 16px; }
.grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: var(--gap); }
@media (min-width: 640px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px){ .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.status { color: var(--muted); margin: 16px 0; }

.skeletons { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: var(--gap); }
@media (min-width: 640px) { .skeletons { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.sk { height: 120px; border-radius: 16px; background: #f3f3f3; box-shadow: 0 6px 22px rgba(0,0,0,.06); }
</style>
