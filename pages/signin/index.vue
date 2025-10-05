<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'auth',
  authAccess: 'unauth',
});
useHead({
  title: useHeadTitle('Sign in'),
});
</script>

<template>
  <div class="o-wrapper-sign">
    <div class="o-wrapper-sign__inner">
      <SignInPart
        id-els-prefix="signin-"
      />
    </div>
  </div>
</template>
