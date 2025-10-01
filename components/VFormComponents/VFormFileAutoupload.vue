<script setup lang="ts">
import { inject } from 'vue';
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import type * as dto from '~t/responces/files.dto';

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
    type: Array as PropType<(string|number)[]>,
    default: () => [],
  },
  preset: {
    type: Array as PropType<dto.ResFile[]>,
    default: () => [],
  },
  classPrefix: {
    type: String,
    default: undefined,
  },
  textDescription: {
    type: String,
    default: undefined,
  },
  textFormat: {
    type: String,
    default: undefined,
  },
  iconName: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue', 'touched']);
const limitFilesUpload: number = inject('LIMIT_FILE_UPLOAD', 1000);

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
        <FileUploadApi
          :disabled="inputValue?.length >= limitFilesUpload"
          :input-id="finalId"
          :model-value="inputValue"
          :preset="props.preset"
          :class-prefix="props.classPrefix"
          :text-description="props.textDescription"
          :text-format="props.textFormat"
          :icon-name="props.iconName"
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
