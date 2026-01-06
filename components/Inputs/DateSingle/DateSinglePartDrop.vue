<script setup lang="ts">
import { startOfDay } from 'date-fns';
import type * as DateTypes from '~t/DateRange';

const emit = defineEmits(['submit', 'reset']);

const props = defineProps({
  minDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
  maxDate: {
    type: Date as PropType<DateTypes.DateOpt>,
    default: null,
  },
  val: {
    type: Object as PropType<DateTypes.DateOpt>,
    default: null,
  },
  triggerOpened: {
    type: Boolean,
    default: false,
  },
});

const elDatePicker = ref();
const date = ref<DateTypes.DateOpt>();
const minDay = computed(() => props.minDate ? startOfDay(props.minDate) : null);
const maxDay = computed(() => props.maxDate ? startOfDay(props.maxDate) : null);

function scrollToSelectedDate () {
  if (!(elDatePicker.value?.move && date.value)) return;
  elDatePicker.value.move(date.value);
}

// adjust date by min max limit in component
function getLimitedDate (myDate: Date) {
  let returnedDate = myDate;
  if (minDay.value && myDate < minDay.value) {
    returnedDate = minDay.value;
  }
  if (maxDay.value && myDate > maxDay.value) {
    returnedDate = maxDay.value;
  }
  return startOfDay(returnedDate);
}

// ---- SETERS OF DATE -----

function setDate (newVal: DateTypes.DateOpt, importantScroll = false) {
  const isExecute = date.value !== newVal;
  if (isExecute) date.value = newVal;
  if (isExecute || importantScroll) scrollToSelectedDate();
}

function setDateFromVal (newVal: DateTypes.DateOpt, importantScroll = false) {
  setDate(newVal ? getLimitedDate(newVal) : null, importantScroll);
}

// ---/ SETERS OF DATE -----

// ---- EXECUTION -------
watch(() => props.val, val => setDateFromVal(val), { immediate: true });
watch(() => props.triggerOpened, (val) => {
  if (!val) return;
  setDateFromVal(props.val, true);
});

function onApply () { emit('submit', date.value); }

// ---/ EXECUTION -------
</script>
<template>
  <div class="o-date-dropdown">
    <div class="o-date-dropdown__picker">
      <VDatePicker
        ref="elDatePicker"
        v-model="date"
        :min-date="minDay"
        :max-date="maxDay"
        :masks="{ weekdays: 'WW' }"
        :columns="1"
        :range="{
          from: new Date(),
          to: new Date()
        }"
        :step="1"
        transparent
        borderless
        class="o-date-picker"
      />
      <div class="o-date-dropdown__control">
        <VBtn
          class="o-date-dropdown__control-btn"
          data-test="reset-btn-date-single"
          view-mode="secondary"
          @click="$emit('reset', $event)"
        >
          Reset
        </VBtn>
        <VBtn
          data-test="apply-btn-date-single"
          class="t-ml-4 o-date-dropdown__control-btn"
          @click="onApply"
        >
          Apply
        </VBtn>
      </div>
    </div>
  </div>
</template>
