<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';

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
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'touched']);

const {
  finalId,
  inputValue,
  onBlur,
  toEmit,
  errorMessage,
  // isError,
  // meta,
} = useVFormCommon({
  props,
  emit,
});

function onChange (val: any) {
  const emitedVal = val.target?.checked;
  onBlur();
  toEmit(emitedVal, emitedVal);
}
</script>

<template>
  <label :for="finalId" class="v-checkbox-button t-font-bold t-text-sm">
    <input
      :id="finalId"
      type="checkbox"
      class="v-checkbox-button__input"
      :name="props.name"
      :data-error="errorMessage"
      value="1"
      :checked="inputValue"
      @change="onChange"
    >
    <span class="v-checkbox-button__label">{{ props.label }}</span>
  </label>
</template>

<style scoped lang="scss">
.v-checkbox-button {
  cursor: pointer;
  display: inline-block;
  padding: 0;
  position: relative;

  &__input {
    cursor: pointer;
    opacity: 0;
    position: absolute;
  }

  &__label {
    background-color: theme('colors.white');
    border: 1px solid theme('colors.secondaryStroke');
    border-radius: 8px;
    color: #9299a5;
    cursor: pointer;
    display: inline-block;
    padding: 6px 12px;
    text-align: center;
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
    user-select: none;
  }

  &__input:checked + &__label {
    background-color: theme('colors.secondaryItems');
    border: 1px solid theme('colors.secondaryItems');
    color: theme('colors.white');
  }
}
</style>
