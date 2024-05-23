<script setup>
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
</script>
<template>
  <RouterView></RouterView>
</template>