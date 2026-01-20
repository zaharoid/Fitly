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


const optionTooltipDirection = computed(() => {
  return 'top';
});

const emit = defineEmits(['update:modelValue', 'touched', 'isError']);

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
watch(() => isError.value, (val) => {
  emit('isError', val);
});
</script>
<template>
  <div
    class="o-field v-field-file-category"
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
          <template #singleLabel="slotProps">
            <p v-tooltip="slotProps.option.title" class="u-cut-text">
              {{ slotProps.option.title }}
            </p>
          </template>
          <template
            #option="slotProps"
          >
            <slot name="option" v-bind="slotProps">
              <p v-if="optionTooltipDirection === 'right'" v-tooltip.right="slotProps.option?.title" class="v-select-option u-cut-text">
                {{ slotProps.option.title }}
              </p>
              <p v-else v-tooltip.bottom="slotProps.option?.title" class="v-select-option u-cut-text">
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
.v-field-file-category {
  @screen md {
    max-width: 50%;
  }
}

.v-select-option {
  margin: -12px -16px;
  padding: 12px 16px;
}
</style>
