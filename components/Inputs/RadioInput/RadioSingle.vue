<script lang="ts" setup>
const props = defineProps({
  idElsPrefix: {
    type: String,
    default: '',
  },
  name: { // name of group where radioSingle is
    type: String,
    default: null,
  },
  label: { // outputed name
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  value: { // value of radio button it is like id
    type: [String, Number],
    default: null,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
});

defineEmits(['update:modelValue']);

const finalId = computed(() => `${props.idElsPrefix || `${props.name}-`}${props.value}`);
</script>
<template>
  <label
    :for="finalId"
    class="o-ratio"
  >
    <input
      :id="finalId"
      type="radio"
      :name="props.name"
      :data-test="`field-${props.name}`"
      :disabled="props.disabled"
      :value="props.value"
      :checked="props.value === props.modelValue"
      @change="$emit('update:modelValue', value)"
    >
    <span />
    <div class="o-ratio__label">
      <slot />
    </div>
  </label>
</template>
