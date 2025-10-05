<script setup lang="ts">
import * as Yup from 'yup';
import { LINK_SIGNIN } from '~/entries/pageLinks';
import type { Field } from '~/types/Form/Field';
import type { FValues } from '~/types/Form/FValues';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{(e: 'submit', event: object): void}>();

const FIELDS = computed<Field[]>(() => {
  return [
    {
      label: 'Email',
      name: 'email',
      fieldMode: 'input',
      placeholder: "yourname@domain.com",
      type: 'text',
      validation: Yup.string().trim().email().matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Must be a valid email or alphanumeric string with only dot, dash, plus and underscore as special characters',
      ).min(6).required().label('Email'),
    },
  ];
});

const validationSchema = computed(() => utilGetValidationSchema(FIELDS.value));

function onSubmit (vals: unknown) {
  if (props.loading) return;
  emit('submit', { ...vals, email: vals.email.trim() });
}
</script>
<template>
  <div class="t-flex t-flex-col">
    <VForm
      :id="`${props.idElsPrefix}personal-form`"
      :validation-schema="validationSchema"
      class="t-flex t-flex-col t-w-full"
      @submit="onSubmit"
    >
      <FormGroup
        :fields="FIELDS"
        field-class-name="t-mb-4"
      />
      <VBtn
        :id="`${props.idElsPrefix}personal-submit`"
        class="t-w-full t-mt-4"
        type="submit"
        :disabled="props.loading"
      >
        Continue
      </VBtn>
    </VForm>
    <!-- !lang -->
    <p class="o-text-separate t-mt-12">
      <span class="o-text-separate__inner">
        Already have an account?
        <!-- !lang -->
      </span>
    </p>
    <VLinkBtn
      :id="`${props.idElsPrefix}alt-link`"
      tag="NuxtLink"
      :to="LINK_SIGNIN()"
      view-mode="ghost-primary"
      class="t-mt-4 t-self-center"
    >
      Sign in
    </VLinkBtn>
  </div>
</template>
