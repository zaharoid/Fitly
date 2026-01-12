<script setup lang="ts">
import * as Yup from 'yup';
import type { Field } from '~/types/Form/Field';
import CircleBadge from '../Athoms/Badge/CircleBadge.vue';
import SvgLogo from '../Athoms/Svg/SvgLogo.vue';

const props = defineProps({
  idElsPrefix: {
    type: String,
    default: '',
  },
});

// const { t } = useI18n();
const route = useRoute();
const { signIn } = useAuth()

const loginGoogle = async () => {
  loading.value = true
  await signIn('google', { callbackUrl: '/' })
  loading.value = false
}

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

const validationSchema = utilGetValidationSchema(FIELDS);

const mainError = ref('');
const loading = ref(false);

async function onSubmit (vals: Submit|unknown) {
  if (loading.value) return;
  mainError.value = '';
  loading.value = true;
}
</script>
<template>
    <transition name="u-opac">
      <LoadingOverlay
        v-if="loading"
        overlay="semi"
        mode="full-fixed"
      />
    </transition>
  <div class="t-flex t-flex-col">
    <SignHeading>
      Sign in your account
    </SignHeading>
    <span class="t-text-secondaryText t-mb-6">Quick and secure — no password required </span>
    <TransitionExpand>
      <SignMainMessage
        v-if="mainError"
        :id-els-prefix="props.idElsPrefix"
        class="t-mb-6"
      >
        {{ mainError }}
      </SignMainMessage>
    </TransitionExpand>
    <div class="t-flex t-gap-4 t-mb-8">
      <VBtn
        :id="`${props.idElsPrefix}submit`"
        class="t-w-full"
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
      :id="`${props.idElsPrefix}submit`"
      class="t-w-full"
      :disabled="loading"
      @click="navigateTo('/signin/magic-link')"
    >
      Magic Link
    </VBtn>
    </div>
    <span class="t-text-secondaryText">By clicking the button, you agree to the Terms and Conditions and Privacy Policy.</span>
  </div>
</template>
Last few GCs