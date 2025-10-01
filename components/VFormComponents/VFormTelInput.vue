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
    type: String,
    default: '',
  },
  isPrefixLetter: {
    type: Boolean,
    default: false,
  },
  disabledPrefixLetter: {
    type: Boolean,
    default: false,
  },
  numLength: {
    type: Number,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue', 'touched', 'validate']);

const {
  finalId,
  inputValue,
  onBlur,
  toEmit,
  errorMessage,
  isError,
  meta,
} = useVFormCommon({
  props,
  emit,
});

function onChange (val: any) {
  toEmit(val, val);
}
</script>
<template>
  <div
    class="o-field"
    :class="{ [`o-field--${viewMode}`]: viewMode }"
  >
    <div class="o-field__inner">
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <label
        v-if="props.label"
        v-htmlsafe="props.label"
        class="o-field__label"
        :for="finalId"
      />
      <!-- eslint-enable -->
      <div class="o-field__input">
        <TelInput
          :id="finalId"
          :model-value="inputValue"
          :name="props.name"
          :is-error="isError"
          :data-error="errorMessage"
          :show-self-error="false"
          @update:model-value="onChange"
          @blur="onBlur"
          @validate="$emit('validate', $event)"
        />
      </div>
      <VFormHelpMessage
        :view="props.viewMessage"
        :error-message="errorMessage"
        :success-message="props.successMessage"
        :input-id="finalId"
        :valid="meta.valid"
      />
    </div>
  </div>
</template>
