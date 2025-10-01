<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import commonSelectProps from './commonSelectProps';

const props = defineProps({
  ...commonProps,
  ...commonSelectProps,
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
      <div class="o-field__input">
        <SwitchInput
          :id="finalId"
          :name="props.name"
          :data-error="errorMessage"
          :disabled="props.disabled"
          :checked="inputValue"
          @update:checked="onChange"
        >
          {{ props.label }}
        </SwitchInput>
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
