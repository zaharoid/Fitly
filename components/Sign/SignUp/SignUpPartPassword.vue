<script setup lang="ts">
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

defineEmits<{(e: 'submit', event: object): void}>();
</script>
<template>
  <PasswordForm
    :id-els-prefix="props.idElsPrefix"
    :field-password="{ name: 'password' }"
    :field-repeat-password="{ name: 'repeat_password' }"
    submit-text="Complete registration"
    :loading="props.loading"
    @submit="$emit('submit', $event)"
  />
</template>
