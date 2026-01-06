<script setup lang="ts">
import { useBlurCloser } from '~/compasables/useBlurCloser';
import type * as DateTypes from '~t/DateRange';

const props = defineProps({
  modelValue: {
    type: Object as PropType<DateTypes.DateOpt>,
    default: null,
  },
  defaultValue: {
    type: Object as PropType<DateTypes.DateOpt>,
    default: null,
  },
  name: {
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
  inputId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);

const elTrigger = ref<HTMLElement | null>(null);
const elDropdown = ref<HTMLElement | null>(null);
const dropdownOpened = ref(false);

useBlurCloser({
  opened: dropdownOpened,
  onClose: () => { dropdownOpened.value = false; },
  elTrigger,
  elDropdown,
});

type Position = { left?: string }
const posDropdown = ref<Position>({});
function getPosDropdown () {
  if (!elTrigger.value) return {};
  const spaceToRightScreen = window.innerWidth - elTrigger.value.getBoundingClientRect().left;
  const offset = spaceToRightScreen - 280;
  if (offset < 0) return { left: `${offset}px` };
  return {};
}

watch(dropdownOpened, (val) => {
  if (!val) return;
  posDropdown.value = getPosDropdown();
});

function toToggle () { dropdownOpened.value = !dropdownOpened.value; }
function toOpen () { dropdownOpened.value = true; }

const localValue = ref(props.modelValue);
watch(() => props.modelValue, (val) => { localValue.value = val; });

function onSubmit (newVal: DateTypes.DateOpt) {
  localValue.value = newVal;
  emit('update:modelValue', newVal);
}

function onSubmitAndClose (newVal: DateTypes.DateOpt) {
  dropdownOpened.value = false;
  onSubmit(newVal);
}

function onReset () {
  dropdownOpened.value = false;
  localValue.value = props.defaultValue;
  emit('update:modelValue', props.defaultValue);
}
</script>
<template>
  <div class="o-date">
    <DateSinglePartInput
      :id="props.inputId"
      :ref="(el: any) => { if (el) elTrigger = el?.$el || el; }"
      :name="props.name"
      :disabled="props.disabled"
      :model-value="localValue"
      @update:model-value="onSubmit"
      @to-toggle="toToggle()"
      @to-open="toOpen()"
    />
    <transition name="u-opac">
      <DateSinglePartDrop
        v-show="dropdownOpened"
        :ref="(el: any) => { if (el) elDropdown = el?.$el || el; }"
        class="o-date__drop"
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
</template>
