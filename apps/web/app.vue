<template>
  <div class="app-layout">
    <NavBar />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// App root layout — provides NavBar + page slot
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--arc-gradient-dark);
}

main {
  min-height: calc(100vh - 72px);
}
</style>
