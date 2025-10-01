<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import type * as DateTypes from '~t/DateRange';

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
    type: [String, Number],
    default: null,
  },
  minDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
  maxDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'touched']);

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
  onBlur();
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
        <DateSingle
          :input-id="finalId"
          :model-value="inputValue"
          :name="props.name"
          :data-error="errorMessage"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :is-error="isError"
          :disabled="props.disabled"
          @update:model-value="onChange"
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
