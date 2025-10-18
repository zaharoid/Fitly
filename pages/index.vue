<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'default',
  authAccess: 'auth',
});
useHead({
  title: useHeadTitle('Sign in'),
});
console.log(123123123123123);

</script>

<template>
  <!-- <SvgLogo /> -->
</template>
