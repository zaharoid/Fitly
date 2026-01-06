<script setup lang="ts">
import type { OptionSelect, OptionId } from '~t/Option';

type SettedOption = OptionSelect | null;

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [Number, String] as PropType<OptionId>,
    default: null,
  },
  options: {
    type: Array as PropType<OptionSelect[]>,
    default: () => [],
  },
  zeroItemName: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  isError: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  autoReselect: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxLabelLength: {
    type: Number,
    default: -1,
    validator: (val: number) => (val >= -1),
  },
});

const emit = defineEmits(['update:modelValue']);

const zeroId = 'all_select_input_id';
let innerChange = false;

const {
  modelValue,
  options,
  zeroItemName,
  autoReselect,
  maxLabelLength,
} = toRefs(props);

const selected = ref<SettedOption>(null);

const refactoringOptions = computed((): OptionSelect[] => {
  if (zeroItemName.value) {
    return [
      { title: zeroItemName.value, id: zeroId },
      ...options.value,
    ];
  }
  return [...options.value];
});

function updateSelected (option: SettedOption) {
  selected.value = (option && option.id === zeroId) ? null : option;
  const emitedId = selected.value ? selected.value.id : null;
  if (modelValue.value === emitedId) return;
  innerChange = true;
  emit('update:modelValue', emitedId);
}
function setModelSelected (optionId : OptionId) {
  let option = refactoringOptions.value.find(item => item.id === optionId);
  if (autoReselect.value && !option) {
    option = refactoringOptions.value[0];
  }
  const defaultOption = optionId ? { title: `Unknown option: ${optionId}`, id: optionId } : null;
  updateSelected(option || defaultOption);
}
function getShortLabel (text: string) {
  if (typeof text !== 'string') return text;
  if (maxLabelLength.value === -1) return text;
  if (text.length <= maxLabelLength.value) return text;
  return `${text.substring(0, maxLabelLength.value)}...`;
}

setModelSelected(modelValue.value);
watch(modelValue, (val) => {
  if (innerChange) {
    innerChange = false;
    return;
  }
  setModelSelected(val);
});
watch(options, () => {
  setModelSelected(modelValue.value);
});

const slots = useSlots();
</script>
<template>
  <Multiselect
    :id="props.id"
    class="o-input-selector"
    :class="{ 'o-input-selector--critical': isError }"
    :options="refactoringOptions"
    track-by="id"
    label="title"
    :placeholder="placeholder"
    :searchable="searchable"
    :allow-empty="false"
    :show-labels="false"
    :disabled="disabled"
    :model-value="selected"
    :data-test="`field-${name}`"
    @update:model-value="updateSelected"
  >
    <template #singleLabel="{ option }">
      <slot
        name="singleLabel"
        :option="option"
        :short-label="getShortLabel(option.title)"
      >
        {{ getShortLabel(option.title) }}
      </slot>
    </template>
    <template
      v-if="slots.option"
      #option="{ option }"
    >
      <slot
        name="option"
        :option="option"
      />
    </template>
  </Multiselect>
</template>
