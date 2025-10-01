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
    default: true,
  },
  numLength: {
    type: Number,
    default: undefined,
  },
});

type Emit = {
  (e: 'update:modelValue', val: string): void
  (e: 'touched', val: boolean): void
}
const emit = defineEmits<Emit>();

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

function onChange (val: any) { toEmit(val, val); }
</script>
<template>
  <div
    class="o-field"
    :class="{ [`o-field--${viewMode}`]: viewMode }"
  >
    <label
      :for="finalId"
      class="o-field__inner"
    >
      <p
        v-if="props.label"
        v-htmlsafe="props.label"
        class="o-field__label"
      />
      <div class="o-field__input">
        <OtpInput
          :id="finalId"
          :is-error="isError"
          :name="props.name"
          :model-value="inputValue"
          :disabled="props.disabled"
          :is-prefix-letter="props.isPrefixLetter"
          :disabled-prefix-letter="props.disabledPrefixLetter"
          :num-length="props.numLength"
          input-type="tel"
          :data-error="errorMessage"
          @blur="onBlur"
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
    </label>
  </div>
</template>
