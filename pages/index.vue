<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'default',
  authAccess: 'auth',
});

onMounted(() => {
  useHeadTitle('Главная');
});

</script>

<template>
  <!-- <SvgLogo /> -->
</template>
