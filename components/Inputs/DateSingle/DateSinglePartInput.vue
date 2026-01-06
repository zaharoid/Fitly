<script setup lang="ts">
import _ from 'lodash';
import { parse, format } from 'date-fns';
import type * as DateTypes from '~t/DateRange';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Object as PropType<DateTypes.DateOpt>,
    default: null,
  },
});

const emit = defineEmits(['toOpen', 'toToggle', 'update:modelValue']);

const formatStr = 'yyyy-MM-dd';
const mask = '####-##-##';

// --- 01. helpers date
function parseForce (dateStr: string) {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const yearNum = Number(yearStr);
  const monthNum = Number(monthStr) - 1;
  const dayNum = Number(dayStr);
  return new Date(yearNum, monthNum, dayNum);
}

function parseLight (dateStr: string) {
  return parse(dateStr, formatStr, new Date());
}

function dateToFormat (myDate: Date) {
  return format(myDate, formatStr);
}

function getCorrectStrDate (dateStr: string) {
  const myDate = parseForce(dateStr);
  return dateToFormat(myDate);
}

// ---end- helpers date

function generateInputVals (val: DateTypes.DateOpt) {
  return val ? dateToFormat(val) : '';
}

const inputVals = ref<string>();

watch(() => props.modelValue, (val) => {
  inputVals.value = generateInputVals(val);
}, { immediate: true });

function fixDateByWatch (myVariable: Ref) {
  const setCorrect = (val: string) => {
    myVariable.value = getCorrectStrDate(val);
  };
  const setCorrectDeb = _.debounce(setCorrect, 50);

  watch(myVariable, (val) => {
    if (val.length !== formatStr.length) return;
    setCorrectDeb(val);
  });
}
fixDateByWatch(inputVals);

watch(inputVals, (val) => {
  if (!val) {
    emit('update:modelValue', null);
    return;
  }
  if (val.length !== formatStr.length) return;
  const valDate = parseLight(val);
  if (valDate.toString() === 'Invalid Date') return;
  emit('update:modelValue', valDate);
});

const firstInput = ref<HTMLInputElement>();
function onSelfClick () {
  if (!firstInput.value) return;
  firstInput.value.focus();
}
</script>
<template>
  <div>
    <!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div
      class="o-input o-date-trigger"
      :class="{ 'o-input--disabled': props.disabled }"
      @click.self="onSelfClick"
    >
      <input
        :id="props.id"
        ref="firstInput"
        v-model="inputVals"
        v-maska
        :data-maska="mask"
        :disabled="props.disabled"
        :data-test="`field-${props.name}`"
        placeholder="yyyy-mm-dd"
        class="o-date-trigger__input t-mr-1"
        @focus.prevent="$emit('toOpen', $event)"
      >
      <button
        type="button"
        :disabled="props.disabled"
        class="o-date-trigger__icon icon-action-calendar t-ml-auto"
        @click="$emit('toToggle', $event)"
      />
    </div>
    <!-- eslint-enable -->
  </div>
</template>
