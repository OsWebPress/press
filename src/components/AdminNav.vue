<script setup>
import navData from '@/assets/adminNavigation.json'
</script>

<template>
  <nav class="bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center gap-4">
    <router-link
      v-for="item in navData"
      :key="item.url"
      :to="item.url"
      class="no-underline flex items-center"
    >
      <img v-if="item.image" :src="item.image" :alt="item.text" class="h-6 rounded" />
      <span v-else class="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">{{ item.text }}</span>
    </router-link>
  </nav>
</template>
