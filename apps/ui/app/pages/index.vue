<template>
  <main>
    <h2 class="text-3xl">{{ $t("Home.Welcome") }}</h2>
    <h6 class="text-l">{{ count }}</h6>
  </main>
</template>

<script setup lang="ts">
const { count } = useCounterStore();
</script>
