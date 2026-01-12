<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'default',
  authAccess: 'auth',
});

onMounted(() => {
  useHeadTitle('Home');
});

</script>

<template>
  <!-- <SvgLogo /> -->
</template>
