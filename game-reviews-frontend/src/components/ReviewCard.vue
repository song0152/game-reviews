<template>
  <article
    class="card"
    @click="$router.push({ name: 'review', params: { id: review.docId || review.id } })"
  >
    <div class="thumb">
      <img v-if="fullImageUrl" :src="fullImageUrl" :alt="review.title" />
      <span v-if="review.rating !== '-'" class="badge" :class="badgeClass">
        {{ review.rating }}
      </span>
    </div>
    <div class="content">
      <h3 class="title line-2">{{ review.title }}</h3>
      <p class="meta">
        <span>Platform: {{ review.platform }}</span>
      </p>
      <p class="excerpt line-2">{{ review.excerpt }}</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { toMediaUrl } from '../api/api';

const props = defineProps({ review: { type: Object, required: true } });

const fullImageUrl = computed(() =>
  props.review?.imageUrl ? toMediaUrl(props.review.imageUrl) : ''
);

const badgeClass = computed(() => {
  const val = Number(props.review?.rating);
  if (isNaN(val)) return 'score-mixed';
  if (val >= 85) return 'score-great';
  if (val >= 70) return 'score-good';
  return 'score-mixed';
});

defineProps({
  review: {
    type: Object,
    default: () => ({ title: '', excerpt: '', cover: '', platform: '', rating: '' })
  }
});
</script>

<style scoped>
.card {
  background: #fff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.06);
  overflow: hidden; cursor: pointer; transition: transform .12s ease, box-shadow .12s ease;
  display: flex; flex-direction: column;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); }

.thumb { position: relative; }
.thumb img {
  width: 100%; aspect-ratio: 16 / 9; object-fit: cover; object-position: center;
}
.badge {
  position: absolute; left: 10px; bottom: 10px;
  min-width: 36px; height: 28px; padding: 0 8px;
  border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,.25);
}

.score-great { background: #2ca54a; }  /* 85+ */
.score-good  { background: #f4b400; }  /* 70–84 */
.score-mixed { background: #e85d3b; }  /* <70 */

.content { padding: 14px; }
.title { margin: 0 0 6px; line-height: 1.3; }
.meta { font-size: 13px; color: #666; display: flex; gap: 12px; }
.excerpt { margin-top: 6px; color: #333; }

.line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .card { border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,.05); }
  .badge { left: 8px; bottom: 8px; min-width: 32px; height: 26px; }
}

</style>
