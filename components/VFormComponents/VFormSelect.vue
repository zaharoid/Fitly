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
    type: [String, Number],
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

const slots = defineSlots();
</script>
<template>
  <div
    class="o-field"
    :class="{ [`o-field--${viewMode}`]: viewMode }"
  >
    <div class="o-field__inner">
      <VFormLabel
        :name="finalId"
        :label="props.label"
        :tooltip="props.tooltip"
      />
      <div class="o-field__input">
        <SelectInput
          :id="finalId"
          :model-value="inputValue"
          :name="props.name"
          :data-error="errorMessage"
          :zero-item-name="props.zeroItemName"
          :options="props.options"
          :placeholder="props.placeholder"
          :is-error="isError"
          :searchable="props.searchable"
          :auto-reselect="props.autoReselect"
          :disabled="props.disabled"
          :max-label-length="props.maxLabelLength"
          @update:model-value="onChange"
        >
          <template
            v-if="slots.singleLabel"
            #singleLabel="slotProps"
          >
            <slot name="singleLabel" v-bind="slotProps" />
          </template>
          <template
            v-if="slots.option"
            #option="slotProps"
          >
            <slot name="option" v-bind="slotProps" />
          </template>
        </SelectInput>
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
