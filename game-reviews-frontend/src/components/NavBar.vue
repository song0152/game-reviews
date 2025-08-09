<template>
  <header class="site-header">
    <nav class="nav container">
      <!-- Brand: image logo -->
      <RouterLink class="brand" to="/" aria-label="Game Reviews Home">
        <img class="logo" src="/logo.png" alt="Video Game Review Logo" />
      </RouterLink>

      <ul class="menu">
        <li v-for="p in platforms" :key="p.value">
          <RouterLink
            :to="p.value === 'all' ? { name: 'home', query: qObj } : { name: 'platform', params: { platform: p.value }, query: qObj }"
            class="link"
            :class="{ active: isActive(p.value) }"
          >
            {{ p.label }}
          </RouterLink>
        </li>
      </ul>

      <form class="searchbar" @submit.prevent="applySearch">
        <input
          v-model.trim="keyword"
          type="search"
          placeholder="Search reviews..."
          aria-label="Search"
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

const route = useRoute();
const router = useRouter();

const platforms = [
  { label: 'All', value: 'all' },
  { label: 'PC', value: 'PC' },
  { label: 'PS5', value: 'PS5' },
  { label: 'PS4', value: 'PS4' },
  { label: 'Xbox', value: 'Xbox' },
  { label: 'Nintendo Switch', value: 'Nintendo Switch' },
  { label: 'Mobile', value: 'Mobile' },
];

const keyword = ref(route.query.q?.toString() || '');
watch(() => route.query.q, (v) => { keyword.value = v?.toString() || ''; });

const qObj = computed(() => (keyword.value ? { q: keyword.value } : {}));

function applySearch() {
  const currentPlatform = route.name === 'platform' ? route.params.platform : 'all';
  const dest = currentPlatform && currentPlatform !== 'all'
    ? { name: 'platform', params: { platform: currentPlatform }, query: qObj.value }
    : { name: 'home', query: qObj.value };
  router.push(dest);
}

function isActive(val) {
  if (val === 'all') return route.name === 'home';
  return route.name === 'platform' && String(route.params.platform) === String(val);
}
</script>

<style scoped>
.site-header { border-bottom: 1px solid #eee; background: #fff; }

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;                 
}
.container { max-width: 1100px; margin: 0 auto; padding: 10px 16px; }

.brand { display: inline-flex; align-items: center; text-decoration: none; }
.logo  { height: 108px; width: auto; display: block; }

.menu {
  display: flex; gap: 10px; list-style: none; margin: 0; padding: 0;
  overflow-x: auto;               
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.menu::-webkit-scrollbar { display: none; }

.link { text-decoration: none; color: #444; padding: 6px 10px; border-radius: 999px; }
.link.active, .link:hover { background: #f1edff; color: #6c4ad0; }

.searchbar {
  margin-left: auto; display: flex; gap: 8px; align-items: center;
}
.searchbar input {
  border: 1px solid #ddd; border-radius: 10px; padding: 8px 10px; min-width: 240px;
}
.searchbar button {
  border: none; border-radius: 10px; padding: 8px 12px; background: #6c4ad0; color: #fff; cursor: pointer;
}
.searchbar button:hover { opacity: .9; }

@media (max-width: 768px) {
  .searchbar { order: 3; width: 100%; margin-left: 0; }    
  .searchbar input { width: 100%; min-width: 0; }         
  .menu { order: 2; width: 100%; }                         
  .logo { height: 28px; }                                  
}

@media (max-width: 400px) {
  .searchbar button { padding: 8px 10px; }
}
</style>

