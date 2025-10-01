<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import commonSelectProps from './commonSelectProps';
import { useWindowSize } from '~/.nuxt/imports';

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

const { width } = useWindowSize();

const optionTooltipDirection = computed(() => {
  if (width.value > 1000) return 'right';
  return 'top';
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
            #option="slotProps"
          >
            <slot name="option" v-bind="slotProps">
              <p v-if="optionTooltipDirection === 'right'" v-tooltip.right="slotProps.option?.tooltip" class="v-select-option">
                {{ slotProps.option.title }}
              </p>
              <p v-else v-tooltip.bottom="slotProps.option?.tooltip" class="v-select-option">
                {{ slotProps.option.title }}
              </p>
            </slot>
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

<style lang="scss">
.v-select-option {
  margin: -12px -16px;
  padding: 12px 16px;
}
</style>
