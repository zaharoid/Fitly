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
    type: [String, Number],
    default: null,
  },
  groups: {
    type: Array,
    default: () => [],
  },
  viewMode: {
    type: String as PropType<'base' | 'nav'>,
    default: 'base',
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

const componentName = computed(() => {
  switch (props.viewMode) {
  case 'base':
    return resolveComponent('BaseProfileSwitcherGroups');
  case 'nav':
    return resolveComponent('NavProfileSwitcherGroups');
  default:
    return resolveComponent('BaseProfileSwitcherGroups');
  }
});
</script>
<template>
  <div
    class="o-field"
    :class="{ [`o-field--${viewMode}`]: viewMode }"
  >
    <div class="o-field__inner">
      <ClientOnly>
        <component
          :is="componentName"
          :id="finalId"
          :model-value="inputValue"
          :name="props.name"
          :data-error="errorMessage"
          :groups="props.groups"
          :disabled="props.disabled"
          @update:model-value="onChange"
        />
      </ClientOnly>
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
