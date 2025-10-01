<script setup lang="ts">
import type * as DateTypes from '~t/DateRange';

const props = defineProps({
  modelValue: {
    type: Object as PropType<DateTypes.RangeOpt>,
    default: null,
  },
  defaultValue: {
    type: Object as PropType<DateTypes.RangeOpt>,
    default: null,
  },
  isClearable: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  presetRanges: {
    type: Array as PropType<DateTypes.RangePreset[]>,
    default: () => [],
  },
  presetsTitle: {
    type: String,
    default: '',
  },
  minDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
  maxDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const elTrigger = ref<HTMLElement | null>(null);
const elDropdown = ref<HTMLElement | null>(null);
const dropdownOpened = ref(false);
type Position = { left?: string }

const localValue = ref(props.modelValue);

const posDropdown = ref<Position>({});

useBlurCloser({
  opened: dropdownOpened,
  onClose: () => { dropdownOpened.value = false; },
  elTrigger,
  elDropdown,
});

function getPosDropdown () {
  if (!elTrigger.value) return {};
  const spaceToRightScreen = window.innerWidth - elTrigger.value.getBoundingClientRect().left;
  const offset = spaceToRightScreen - 765;
  if (offset < 0) return { left: `${offset}px` };
  return {};
}

function toToggle () { dropdownOpened.value = !dropdownOpened.value; }
function toOpen () { dropdownOpened.value = true; }

function onSubmit (range: DateTypes.RangeOpt) {
  localValue.value = range;
  emit('update:modelValue', range);
}

function onSubmitAndClose (range: DateTypes.RangeOpt) {
  dropdownOpened.value = false;
  onSubmit(range);
}

function onReset () {
  dropdownOpened.value = false;
  localValue.value = props.defaultValue;
  emit('update:modelValue', props.defaultValue ? { ...props.defaultValue } : null);
}

watch(dropdownOpened, (val) => {
  if (!val) return;
  posDropdown.value = getPosDropdown();
});

watch(() => props.modelValue, (val) => { localValue.value = val; });

</script>
<template>
  <div class="o-field">
    <div class="o-field__inner">
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <label
        v-if="props.label"
        v-htmlsafe="props.label"
        class="o-field__label"
        :for="id"
      />
      <div class="o-field__input">
        <DateRangePartInput
          :id="props.id"
          :ref="(el: any) => { if (el) elTrigger = el?.$el || el; }"
          :is-clearable="isClearable"
          :name="props.name"
          :disabled="props.disabled"
          :model-value="localValue"
          @update:model-value="onSubmit"
          @to-toggle="toToggle()"
          @to-open="toOpen()"
          @to-clear="onReset"
        />
      </div>
      <transition name="u-opac">
        <DateRangePartDrop
          v-show="dropdownOpened"
          :ref="(el: any) => { if (el) elDropdown = el?.$el || el; }"
          class="o-date__drop o-date__drop--range"
          :preset-ranges="props.presetRanges"
          :presets-title="props.presetsTitle"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :val="localValue"
          :trigger-opened="dropdownOpened"
          :style="posDropdown"
          @submit="onSubmitAndClose"
          @reset="onReset"
        />
      </transition>
    </div>
  </div>
</template>
