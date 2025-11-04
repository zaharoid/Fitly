<script setup lang="ts">
import * as Yup from 'yup';
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
      <MagicLinkPart
        id-els-prefix="signin-"
      />
    </div>
  </div>
</template>
