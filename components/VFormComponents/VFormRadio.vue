<script lang="ts" setup>
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import type { OptionRadio } from '~t/Option';

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
    default: '',
  },
  options: {
    type: Array as PropType<OptionRadio[]>,
    default: () => [],
  },
  itemLabelMode: {
    type: String as PropType<'default' | 'badge'>,
    default: 'default',
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
      <VFormLabel
        :name="finalId"
        :label="props.label"
        :tooltip="props.tooltip"
      />
      <div class="o-field__input">
        <RadioGroup
          :id="finalId"
          :options="props.options"
          :name="props.name"
          :disabled="props.disabled"
          :data-error="errorMessage"
          :model-value="inputValue"
          @update:model-value="onChange"
        >
          <template
            v-if="props.itemLabelMode === 'badge'"
            #itemLabel="{ item }"
          >
            <div class="v-radio-flag-label">
              <CircleBadge
                v-if="item?.badge"
                v-bind="item.badge"
                class="t-mr-2"
              />
              <span
                v-htmlsafe="item.title"
                class="t-text-base t-text-text"
              />
            </div>
          </template>
          <template
            v-else-if="props.itemLabelMode === 'default'"
            #itemLabel="{ item, isActive }"
          >
            <span
              v-htmlsafe="item.title"
              class="t-text-base t-text-text"
              :class="{ 't-text-secondaryText t-font-bold': isActive }"
            />
          </template>
        </RadioGroup>
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
.v-radio-flag-label {
  align-items: center;
  display: flex;
}
</style>
