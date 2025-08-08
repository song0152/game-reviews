<template>
  <div class="prose">
    <template v-for="(block, i) in blocks" :key="i">
      <component :is="resolveTag(block)" v-html="renderBlock(block)"></component>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  blocks: { type: Array, required: true }
});

function renderInline(children = []) {
  return children
    .map((c) => {
      if (typeof c?.text !== 'string') return '';
      let t = escapeHtml(c.text);
      if (c.bold) t = `<strong>${t}</strong>`;
      if (c.italic) t = `<em>${t}</em>`;
      if (c.underline) t = `<u>${t}</u>`;
      if (c.strikethrough) t = `<s>${t}</s>`;
      if (c.code) t = `<code>${t}</code>`;
      t = t.replace(/\n/g, '<br/>');
      return t;
    })
    .join('');
}

function renderBlock(block) {
  const type = block?.type;
  if (type === 'paragraph') return renderInline(block.children);
  if (type?.startsWith('heading')) return renderInline(block.children);

  if (type === 'list') {
    const tag = block.format === 'ordered' ? 'ol' : 'ul';
    const items =
      (block.children || [])
        .map((li) => `<li>${renderInline(li.children || [])}</li>`)
        .join('') || '';
    return `<${tag}>${items}</${tag}>`;
  }

  return renderInline(block?.children || []);
}

function resolveTag(block) {
  const t = block?.type;
  if (t === 'paragraph') return 'p';
  if (t === 'heading') {
    const level = block?.level || 2;
    return `h${Math.min(Math.max(level, 1), 6)}`;
  }
  if (t?.startsWith('heading')) return t; 
  if (t === 'list') return 'div'; 
  return 'p';
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
</script>

<style scoped>
.prose :deep(p){ margin: 0 0 1rem; line-height: 1.8; }
.prose :deep(h1){ font-size: 1.8rem; margin: 1.2rem 0 .6rem; }
.prose :deep(h2){ font-size: 1.5rem; margin: 1rem 0 .5rem; }
.prose :deep(h3){ font-size: 1.25rem; margin: .8rem 0 .4rem; }
.prose :deep(ul), .prose :deep(ol){ padding-left: 1.2rem; margin: .6rem 0 .8rem; }
.prose :deep(code){ background: #f3f3f4; padding: .15rem .35rem; border-radius: 6px; }
</style>
