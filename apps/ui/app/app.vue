<template>
  <UApp :class="colorMode.value">
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
  const colorMode = useColorMode()
</script>