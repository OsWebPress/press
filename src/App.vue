<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="fixed top-0 left-0 w-full shadow-md z-50 p-4">
    <div class="wrapper flex justify-center items-center">

      <nav>
        <RouterLink to="/render">Render_test</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/admin">Admin</RouterLink>
        <RouterLink to="/admin/editor">Editor</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
