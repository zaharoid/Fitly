<script setup lang="ts">
interface ResendBtn {
  text: string,
  disabled?: boolean,
  action?: Function,
}

const props = defineProps({
  phone: {
    type: String,
    default: '',
  },
  firstLetter: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  resendBtn: {
    type: Object as PropType<ResendBtn | null>,
    default: null,
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
});

defineEmits<{(e: 'submit', event: Object): void}>();
</script>
<template>
  <PartVerifyPhone
    :id-els-prefix="props.idElsPrefix"
    :phone="props.phone"
    :loading="props.loading"
    :field-otp="{ name: 'smsCode' }"
    :first-letter="props.firstLetter"
    :resend-btn="props.resendBtn"
    @submit="$emit('submit', $event)"
  />
</template>
