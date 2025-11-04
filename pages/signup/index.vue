<script lang="ts" setup>
import { useHeadTitle } from '~/compasables/useHead';

type RegistrationBody = {
  email: string
  password: string
  username: string
}

definePageMeta({
  layout: 'auth',
  authAccess: 'unauth',
});
useHead({ title: useHeadTitle('Sign up') });

const { $ufetch } = useNuxtApp();

const route = useRoute();
const router = useRouter();

const mainError = ref('');
const loading = ref(false);


async function onSubmit (body: RegistrationBody) {
  await $ufetch('/api/forms/register', {
    method: 'POST',
    body,
  })
  // mainError.value = '';
  // loading.value = true;
  // const res = await useRequestSignUpCheckEmail(vals);
  // loading.value = false;
  // if (res?.message === 'ok') {
  //   navigateTo('/signup/resend');
  // } else {
  //   mainError.value = res?.message;
  // }
}

const idElsPrefix = 'signup-';
</script>

<template>
  <div class="o-wrapper-sign">
    <!-- <div class="o-wrapper-sign__inner">
      <SignHeading>
        Create new account
      </SignHeading>
      <SignMainMessage
        v-if="mainError"
        :id-els-prefix="idElsPrefix"
        class="t-mb-6"
      >
        {{ mainError }}
      </SignMainMessage>
      <SignUpPartEmail
        :id-els-prefix="idElsPrefix"
        :loading="loading"
        @submit="onSubmit"
      />
    </div>
    <SignNavBottom /> -->
  </div>
</template>
