<template>
  <RouterLink
    :to="{ name: 'review', params: { id: r.id } }"
    class="card"
    aria-label="Open review detail"
  >
    <img v-if="r.cover" :src="r.cover" alt="" class="cover" />
    <div class="body">
      <h3 class="title">{{ r.title }}</h3>
      <p class="excerpt">{{ shortExcerpt }}</p>
      <div class="meta">
        <span v-if="r.platform">{{ r.platform }}</span>
        <span v-if="r.rating">⭐ {{ r.rating }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { normalizeReview } from '../utils/normalize';

const props = defineProps({ review: { type: Object, default: () => ({}) } });
const r = computed(() => normalizeReview(props.review));

const shortExcerpt = computed(() => {
  const t = String(r.value.excerpt || '');
  return t.length > 120 ? `${t.slice(0, 120)}…` : t;
});
</script>

<style scoped>
.card {
  display: flex; flex-direction: column;
  background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 6px 22px rgba(0,0,0,.06);
  transition: transform .15s ease, box-shadow .15s ease;
  color: inherit; text-decoration: none;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(0,0,0,.08); }
.cover { width: 100%; height: 220px; object-fit: cover; }
.body { padding: 14px; }
.title { margin: 0 0 8px; font-size: 20px; line-height: 1.3; color:#111; }
.excerpt { color: #555; margin: 0 0 10px; }
.meta { color: #7b7b7b; font-size: 13px; display: flex; gap: 10px; }
</style>
