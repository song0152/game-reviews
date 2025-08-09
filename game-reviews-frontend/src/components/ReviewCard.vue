<template>
  <article class="card">
    <img v-if="r.cover" :src="r.cover" alt="" class="cover" />
    <div class="body">
      <h3 class="title">{{ r.title || '(no title)' }}</h3>
      <p class="excerpt">{{ shortExcerpt }}</p>

      <div class="meta">
        <span v-if="r.platform">{{ r.platform }}</span>
        <span v-if="r.rating">⭐ {{ r.rating }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { normalizeReview } from '../utils/normalize';

const props = defineProps({
  review: { type: Object, default: () => ({}) }
});

const r = computed(() => normalizeReview(props.review));

const shortExcerpt = computed(() => {
  const t = String(r.value.excerpt || '');
  return t.length > 120 ? `${t.slice(0, 120)}…` : t;
});
</script>

<style scoped>
.card { display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: #fff; }
.cover { width: 100%; height: 180px; object-fit: cover; }
.body { padding: 12px; }
.title { margin: 0 0 8px; font-size: 18px; line-height: 1.3; }
.excerpt { color: #666; margin: 0 0 8px; }
.meta { color: #999; font-size: 13px; display: flex; gap: 8px; }
</style>
