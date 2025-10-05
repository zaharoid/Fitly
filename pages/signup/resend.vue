<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

definePageMeta({
  layout: 'auth',
  authAccess: 'unauth',
});
useHead({ title: useHeadTitle('Sign up') });
</script>
<template>
  <!-- <TemplateResend
    id-els-prefix="signup-"
    name-process="signup"
    back-link="/signup"
    :request="useRequestSignUpCheckEmail"
  /> -->
  <div>
    resend page
  </div>
</template>
