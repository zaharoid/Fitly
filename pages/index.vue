<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'auth',
  authAccess: 'auth',
});
useHead({
  title: useHeadTitle('Sign in'),
});
</script>

<template>
  <div class="o-wrapper-sign">
    <div class="o-wrapper-sign__inner">
      <!-- <SignInPart
        id-els-prefix="signin-"
      /> -->
      MAIN PAGE
    </div>
  </div>
</template>
