<script setup lang="ts">
import commonProps from './commonProps';
import type { RuleValid } from '~t/RuleValid';

const props = defineProps({
  ...commonProps,
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  rules: {
    type: Array as PropType<RuleValid[]>,
    default: () => [],
  },
});

defineEmits<{(e: 'update:modelValue', val: string): void}>();

const isDirty = ref(false);
</script>
<template>
  <VFormInputPassword
    :id="props.id"
    :label="props.label"
    :placeholder="props.placeholder"
    :name="props.name"
    :disabled="props.disabled"
    :view-mode="props.viewMode"
    :view-message="props.viewMessage"
    :success-message="props.successMessage"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="isDirty = true"
  >
    <template #bottom="{ inputValue }">
      <RuleValidList
        :id-els-prefix="props.id"
        :input-id="props.id"
        :val="inputValue"
        :dirty="isDirty"
        :items="props.rules"
        class="t-mt-4"
      />
    </template>
  </VFormInputPassword>
</template>
