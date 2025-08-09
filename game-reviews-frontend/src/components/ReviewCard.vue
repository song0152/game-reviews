<template>
  <article class="card">
    <img v-if="cover" :src="cover" alt="" class="cover" />
    <div class="body">
      <h3 class="title">{{ title }}</h3>
      <p class="excerpt">{{ shortExcerpt }}</p>

      <div class="meta">
        <span v-if="platform">{{ platform }}</span>
        <span v-if="rating">⭐ {{ rating }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  review: { type: Object, default: () => ({}) },
});

const title    = computed(() => String(props.review?.title ?? ''));
const excerpt  = computed(() => String(props.review?.excerpt ?? ''));
const platform = computed(() => String(props.review?.platform ?? ''));
const rating   = computed(() => props.review?.rating ?? '');
const cover    = computed(() => String(props.review?.cover ?? ''));

const shortExcerpt = computed(() => {
  return excerpt.value.length > 120
    ? `${excerpt.value.slice(0, 120)}…`
    : excerpt.value;
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
