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
    :class="{ [`o-field--${props.viewMode}`]: props.viewMode }"
  >
    <div class="o-field__inner">
      <BasicCheckbox
        :id="finalId"
        :name="props.name"
        :data-error="errorMessage"
        :is-error="isError"
        :disabled="props.disabled"
        :checked="inputValue"
        @update:checked="onChange"
      >
        <slot />
        <div class="t-flex t-items-center">
          <div v-htmlsafe="props.label" :for="finalId" />
          <i
            v-if="props.tooltip?.text"
            v-tooltip.right="props.tooltip.text"
            class="icon-item-circle-info t-text-secondaryText t-ml-1"
          />
        </div>
      </BasicCheckbox>
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
