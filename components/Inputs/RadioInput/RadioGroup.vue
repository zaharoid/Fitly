<script lang="ts" setup>
import type { OptionRadio } from '~t/Option';
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'radio-group',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<OptionRadio[]>,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div
    :id="props.id"
    class="o-ratio-group"
  >
    <RadioSingle
      v-for="one in props.options"
      :key="one.id"
      :id-els-prefix="props.id ? `${props.id}-` : ''"
      :value="one.id"
      :name="name"
      :disabled="disabled"
      :model-value="props.modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <slot
        name="itemLabel"
        :item="one"
        :is-active="one.id === props.modelValue"
      >
        <span
          v-htmlsafe="one.title"
        />
      </slot>
    </RadioSingle>
  </div>
</template>
