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
    type: Object,
    default: null,
  },
  walletType: {
    type: String,
    default: '',
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
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <label
        v-if="props.label"
        v-htmlsafe="props.label"
        class="o-field__label"
        :for="finalId"
      />
      <!-- eslint-enable -->
      <div class="o-field__input">
        <PartyInput
          :wallet-type="props.walletType"
          :name="props.name"
          :model-value="inputValue"
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
