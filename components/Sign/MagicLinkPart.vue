<script setup lang="ts">
import type { Field } from '~/types/Form/Field';
import * as Yup from 'yup';
import type { FValues } from '~/types/Form/FValues';
import type { DtoBasic } from '~/types/responces/common.dto';

const props = defineProps({
  idPrefix: {
    type: String,
    default: '',
  },
});

const alertsStore = useAlertsStore();
const route = useRoute();
const { signIn } = useAuth()

interface Submit {
  email: string
  password: string
}

const FIELDS: Field[] = [
  {
    label: 'Email',
    name: 'email',
    fieldMode: 'input',
    placeholder: 'yourname@domain.com',
    validation: Yup.string().trim().matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._+-]+$/,
      'Must be a valid email or alphanumeric string with only dot, dash, plus and underscore as special characters',
    ).min(6).required().label('Email'),
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
const isSuccess = ref(null as boolean | null);

const sendMagicLink = async (body: FValues) => {
  console.log(body);
  loading.value = true
    const res = await signIn('email', {
      email: body.email,
      callbackUrl: '/',
      redirect: false,
    })

    console.log(res);
    if (res?.error) {
    isSuccess.value = false;
    alertsStore.addMessage({
      title: res.error || 'Unknown issue. Ask developer',
      mode: 'danger',
    });
  } else {
    isSuccess.value = true;
    alertsStore.addMessage({
      title: 'A letter with a link has been sent. Please check your email.',
      mode: 'success',
    });
  }
  loading.value = false
}
</script>

<template>
  <div class="t-flex t-flex-col">
    <div v-if="isSuccess" class="t-flex t-flex-col t-justify-center t-items-center t-mb-6">
      <div class="t-flex t-justify-center t-items-center t-mb-4 t-border-4 t-border-success t-rounded-full">
        <i class="icon-action-check-mark t-p-5 t-text-success t-text-[100px]"/>
      </div>
      <p class="t-text-text t-font-bold t-text-xl">Please check your email.</p>
    </div>
    <div v-else>
      <SignHeading>
      Magic link
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
      class="t-flex t-flex-col t-w-full t-mb-6"
      @submit="sendMagicLink"
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
      </template>
      <VBtn
        :id="`${props.idPrefix}submit`"
        class="t-w-full t-mt-4"
        type="submit"
        :disabled="loading || isSuccess === false"
        :loading="loading"
      >
        Submit
      </VBtn>
    </VForm>
    <VLinkBtn
      :id="`${props.idPrefix}alt-link`"
      tag="NuxtLink"
      to="/signin"
      view-mode="ghost-primary"
      class="t-self-center"
    >
      Return to Sign in
    </VLinkBtn>
    </div>
  </div>
</template>