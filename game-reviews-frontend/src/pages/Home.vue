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
    const { data } = await getReviews();
    raw.value = data?.data || [];
    reviews.value = raw.value.map(normalizeReview);
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const filtered = computed(() => {
  const q = (route.query.q?.toString() || '').toLowerCase();
  const plat = route.params.platform ? route.params.platform.toString().toLowerCase() : 'all';

  return reviews.value.filter((r) => {
    const hitQ = !q || [r.title, r.platform, String(r.rating)].some(v => String(v || '').toLowerCase().includes(q));

    const pText = String(r.platform || '').toLowerCase();
    const hitP = plat === 'all' || !plat ? true : pText.includes(plat);

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

