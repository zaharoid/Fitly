<script setup lang="ts">
import * as Yup from 'yup';
import type { Field } from '~/types/Form/Field';
import CircleBadge from '../Athoms/Badge/CircleBadge.vue';

const props = defineProps({
  idPrefix: {
    type: String,
    default: '',
  },
});

// const { t } = useI18n();
const route = useRoute();
const { signIn } = useAuth()

const loginGoogle = () =>
  signIn('google', { callbackUrl: '/' })

const sendMagic = (email: string) =>
  signIn('email', { email, callbackUrl: '/' })

interface Submit {
  email: string
  password: string
}

const FIELDS: Field[] = [
  {
    label: 'Login or Email',
    name: 'email',
    fieldMode: 'input',
    placeholder: 'yourname@domain.com',
    validation: Yup.string().trim().matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._+-]+$/,
      'Must be a valid email or alphanumeric string with only dot, dash, plus and underscore as special characters',
    ).min(6).required().label('Login or email'),
  }, {
    label: 'Password',
    name: 'password',
    fieldMode: 'inputPassword',
    placeholder: 'Type your password',
    validation: Yup.string().required().label('Password'),
  },
];

const twoFaPayload = reactive({
  firstLetter: '',
  isRequired: false,
  phoneNumber: '',
  loading: false,
});

const validationSchema = utilGetValidationSchema(FIELDS);

const mainError = ref('');
const loading = ref(false);

function returnToSignIn () {
  twoFaPayload.isRequired = false;
  twoFaPayload.firstLetter = '';
  twoFaPayload.phoneNumber = '';
}

async function onSubmit (vals: Submit|unknown) {
  if (loading.value) return;
  mainError.value = '';
  loading.value = true;
  console.log(vals);
  
//   try {
//     const res = await useRequestLogin({
//       ...vals,
//       email: vals.email.trim(),
//     });

//     if (res.message === '2fa_required') {
//       twoFaPayload.isRequired = true;
//       twoFaPayload.phoneNumber = res.PhoneNumber || '';
//       twoFaPayload.firstLetter = res.code || '';
//       loading.value = false;
//       return;
//     }

//     if (res?.message === 'ok') {
//       const companiesStore = useCompaniesStore();
//       await companiesStore.updateCompanies();
//       const defaultCompanyId = defaultCompanyIdProfile(res);

//       const skipSelectProfile = companiesStore.companies?.length < 2;
//       if (defaultCompanyId) {
//         if (route.query.redirectedFrom) return await navigateTo(route.query.redirectedFrom as string);
//         await navigateTo(useLinkCompany(LINK_DASHBOARD(), defaultCompanyId));
//       } else if (skipSelectProfile) {
//         await navigateTo(LINK_DASHBOARD());
//       } else {
//         await navigateTo({
//           path: LINK_SELECT_PROFILE(),
//           query: route.query.redirectedFrom
//             ? {
//               redirectedFrom: route.query.redirectedFrom,
//             }
//             : undefined,
//         });
//       }
//     } else {
//       let errorMessage = res?.message;
//       if (errorMessage === 'incorrect_username_or_password') {
//         errorMessage = 'Incorrect combination of email and password';
//       } else if (!errorMessage) {
//         errorMessage = 'unknown error';
//       }
//       mainError.value = errorMessage || '';
//     }
//     loading.value = false;
//   } catch (e) {
//     loading.value = false;
//   }
}
</script>
<template>
  <TwoFaPart
    v-if="twoFaPayload.isRequired"
    v-bind="twoFaPayload"
    @return-signin="returnToSignIn"
  />
  <div v-else class="t-flex t-flex-col">
    <SignHeading>
      Sign in your account
    </SignHeading>
    <TransitionExpand>
      <SignMainMessage
        v-if="mainError"
        :id-els-prefix="props.idPrefix"
        class="t-mb-6"
      >
        {{ mainError }}
      </SignMainMessage>
    </TransitionExpand>
    <VForm
      :validation-schema="validationSchema"
      class="t-flex t-flex-col t-w-full"
      @submit="onSubmit"
    >
      <template
        v-for="f in FIELDS"
        :key="f.name"
      >
        <VFormInput
          v-if="f.fieldMode === 'input'"
          :id="`${props.idPrefix}${f.name}`"
          :name="f.name"
          :label="f.label"
          :placeholder="f.placeholder"
          class="t-mb-4"
          :type="f.type"
          :autocomplete="f.name"
        />
        <VFormInputPassword
          v-if="f.fieldMode === 'inputPassword'"
          :id="`${props.idPrefix}${f.name}`"
          :name="f.name"
          :autocomplete="f.name"
          :label="f.label"
          :placeholder="f.placeholder"
          class="t-mb-4"
        />
      </template>
      <NuxtLink
        data-test="field-forgot-password"
        class="t-font-medium t-text-secondaryItems"
        to="/sign-recovery"
      >
        Forgot your password?
        <!-- !lang -->
      </NuxtLink>
      <VBtn
        :id="`${props.idPrefix}submit`"
        class="t-w-full t-mt-4"
        type="submit"
        :disabled="loading"
      >
        Submit
      </VBtn>
    </VForm>
    <p class="o-text-separate t-mt-10">
      <span class="o-text-separate__inner">
        Or continue with
      </span>
    </p>
    <div class="t-flex t-gap-4">
      <VBtn
        :id="`${props.idPrefix}submit`"
        class="t-w-full t-mt-4 t-flex"
        :disabled="loading"
        view-mode="secondary"
        @click="loginGoogle"
      >
      <div class="t-flex t-items-center t-gap-3">
        <CircleBadge
          size="small"
          :img="{ url: '/img/google.svg', alt: 'Google' }"
      />
      <p>
        Google
      </p>
      </div>
    </VBtn>
    <VBtn
      :id="`${props.idPrefix}submit`"
      class="t-w-full t-mt-4 t-flex"
      :disabled="loading"
    >
      Magic Link
    </VBtn>
    </div>
    <div class="t-flex t-justify-end t-items-center t-gap-2 t-mt-6">
      <span class="t-text-secondaryText">
        Don't have an account yet?
      </span>
      <VLinkBtn
      :id="`${props.idPrefix}alt-link`"
      tag="NuxtLink"
      to="/signup"
      view-mode="ghost-primary"
      class="t-self-center"
    >
      Sign up
    </VLinkBtn>
    </div>
  </div>
</template>
