<template>
  <main>
    <h2 class="text-3xl">{{ $t("Home.Welcome") }}</h2>
    <h6 class="text-l">{{ count }}</h6>
    <UButton @click="isDark = !isDark">{{ isDark ? "Dark" : "Light" }}</UButton>
  </main>
</template>

<script setup lang="ts">
  const { count } = useCounterStore();
  const colorMode = useColorMode();
  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set(_isDark) {
      colorMode.preference = _isDark ? "dark" : "light";
    },
  });
</script>
