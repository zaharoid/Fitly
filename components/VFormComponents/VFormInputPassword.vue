<script setup lang="ts">
import commonProps from './commonProps';

const props = defineProps({
  ...commonProps,
  name: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
    default: 'on',
  },
  id: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits<{(e: 'update:modelValue', val: string): void}>();

const slots = useSlots();

const showPass = ref(false);
function toShowPass (event: any) {
  if (event?.sourceCapabilities?.firesTouchEvents) return;
  showPass.value = true;
}
function toHidePass (event: any) {
  if (event?.sourceCapabilities?.firesTouchEvents) return;
  showPass.value = false;
}
function toTogglePassMobile (event: any) {
  if (!event?.sourceCapabilities?.firesTouchEvents) return;
  showPass.value = !showPass.value;
}

onMounted(() => {
  document.addEventListener('mouseup', toHidePass);
  document.addEventListener('pointerup', toHidePass);
});
onUnmounted(() => {
  document.removeEventListener('mouseup', toHidePass);
  document.removeEventListener('pointerup', toHidePass);
});
</script>
<template>
  <VFormInput
    :id="props.id"
    :label="props.label"
    :placeholder="props.placeholder"
    :name="props.name"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled"
    :view-mode="props.viewMode"
    :view-message="props.viewMessage"
    :success-message="props.successMessage"
    :type="showPass ? 'text' : 'password'"
    :model-value="modelValue"
    :func-btn="{
      icon: showPass ? 'eye-cross' : 'eye',
      action: {
        mousedown: toShowPass,
        click: toTogglePassMobile,
        touchstart: toShowPass,
      },
    }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template
      v-if="slots.bottom"
      #bottom="{ inputValue }"
    >
      <slot name="bottom" :input-value="inputValue" />
    </template>
  </VFormInput>
</template>
