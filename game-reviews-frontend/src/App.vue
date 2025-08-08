<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>

<style>
html, body, #app { height: 100%; margin: 0; background: #fafafa; color: #111; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
</style>
