<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';
import type { BtnViewMode } from '~/types/Btn';
import type { MaskInputOptions } from 'maska';
import MaskaInput from '../Inputs/MaskaInput.vue';

interface PropFuncBtn {
  text?: string,
  icon?: string,
  action: ((...args: unknown[]) => unknown) | { [key: string]: (...args: unknown[]) => unknown },
}

interface PropUnit {
  text?: string,
  icon?: string,
  badge?: { [key: string]: string },
}

const props = defineProps({
  ...commonProps,
  name: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
    default: 'on',
  },
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  maxlength: {
    type: [Number, String],
    default: '',
  },
  counter: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  funcBtn: {
    type: Object as PropType<null | PropFuncBtn>,
    default: null,
  },
  outerFuncBtn: {
    type: Object as PropType<null | {
      text?: string,
      icon?: string,
      mode?: BtnViewMode,
      disabled?: boolean,
      action: (event: Event) => unknown,
    }>,
    default: null,
  },
  unit: {
    type: Object as PropType<null | PropUnit>,
    default: null,
  },
  behaviourMode: {
    type: String as PropType<'money'|'int'>,
    default: null,
  },
});

type Emit = {
  (e: 'update:modelValue' | 'onBlur', val: string): void
  (e: 'touched' | 'isError', val: boolean): void
}
const emit = defineEmits<Emit>();

const slots = useSlots();

const {
  finalId,
  inputValue,
  onChange,
  onBlur,
  errorMessage,
  isError,
  meta,
} = useVFormCommon({
  props,
  emit,
});

const localFuncBtn = computed(() => {
  if (props.funcBtn === null) return null;
  const returnedObj = props.funcBtn;
  if (typeof returnedObj.action === 'function') {
    returnedObj.action = { click: returnedObj.action };
  }
  return returnedObj;
});

const overTextLimit = computed(() => inputValue.value?.length > props.maxlength);

const attrsMain = computed((): { [key: string]: unknown } => {
  return {
    id: finalId.value,
    class: {
      'o-input': true,
      'o-input--critical': isError.value,
      't-pr-16': localFuncBtn.value || props.unit,
    },
    name: props.name,
    type: props.type,
    value: inputValue.value,
    placeholder: props.placeholder,
    disabled: props.disabled,
    'data-error': errorMessage.value,
    'data-test': `field-${props.name}`,
  };
});

const moneyOptions: MaskInputOptions = {
  preProcess: val => val.replace(/[\s]/g, ''),
  postProcess: (val) => {
    if (!val) return '';
    let sub = 3 - (val.includes('.') ? val.length - val.indexOf('.') : 0);
    let myVal = val;
    if (sub < 0) {
      myVal = val.slice(0, sub);
      sub = 0;
    }
    const returned = Intl
      .NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .format(Number.parseFloat(myVal))
      .slice(0, sub ? -sub : undefined)
      .replace(/,/g, ' ');
    return returned;
  },
};

const attrsMaska = computed(() => {
  if (props.behaviourMode === 'money') {
    return {
      options: moneyOptions,
      'data-maska': '0.99',
      'data-maska-tokens': '0:\\d:multiple|9:\\d:optional',
      maxlength: '25',
    };
  }
  if (props.behaviourMode === 'int') {
    return {
      'data-maska': '0',
      'data-maska-tokens': '0:\\d:multiple',
      maxlength: '15',
    };
  }
  return {};
});

const attrsAll = computed(() => {
  const returned = { ...attrsMain.value, ...attrsMaska.value };
  if (props.maxlength) returned.maxlength = props.counter ? undefined : String(props.maxlength);
  return returned;
});

watch(() => isError.value, (val) => {
  emit('isError', val);
});
</script>
<template>
  <div
    class="o-field"
    :class="{ [`o-field--${viewMode}`]: viewMode }"
  >
    <div
      :for="finalId"
      class="o-field__inner"
    >
      <VFormLabel
        :name="finalId"
        :label="props.label"
        :tooltip="props.tooltip"
      />
      <div class="t-flex">
        <div class="o-field__input t-flex-grow">
          <MaskaInput
            v-if="props.behaviourMode"
            :id="finalId"
            v-bind="attrsAll"
            @input="onChange"
            @blur="onBlur"
          />
          <input
            v-else
            :id="finalId"
            :name="finalId"
            :autocomplete="props.autocomplete"
            v-bind="attrsAll"
            @input="onChange"
            @blur="onBlur"
          >
          <div
            v-if="unit"
            class="o-field__unit"
          >
            <i :class="{ [`icon-${unit.icon}`]: unit.icon }" />
            <CircleBadge
              v-if="props.unit?.badge?.img"
              v-bind="props.unit.badge"
              class="t-mr-2"
            />
            <p v-if="unit.text">
              {{ unit.text }}
            </p>
          </div>
          <button
            v-if="localFuncBtn"
            type="button"
            class="o-field__func-btn"
            :data-test="`field-btn-${name}`"
            v-on="localFuncBtn?.action"
          >
            <i :class="{ [`icon-${localFuncBtn.icon}`]: localFuncBtn.icon }" />
            <span v-if="localFuncBtn.text">{{ localFuncBtn.text }}</span>
            <span v-if="!(localFuncBtn.text || localFuncBtn.icon)">Button</span>
          </button>
        </div>
        <VBtn
          v-if="props.outerFuncBtn"
          :view-mode="props.outerFuncBtn.mode || 'secondary'"
          :disabled="props.outerFuncBtn.disabled"
          :data-test="`field-btn-${name}`"
          class="t-ml-2"
          @click="props.outerFuncBtn?.action"
        >
          <i :class="{ [`icon-${props.outerFuncBtn.icon}`]: props.outerFuncBtn.icon }" />
          <span v-if="props.outerFuncBtn.text">{{ props.outerFuncBtn.text }}</span>
          <span v-if="!(props.outerFuncBtn.text || props.outerFuncBtn.icon)">Button</span>
        </VBtn>
      </div>
      <div class="t-flex">
        <VFormHelpMessage
          :view="props.viewMessage"
          :error-message="errorMessage"
          :success-message="props.successMessage"
          :input-id="finalId"
          :valid="meta.valid"
        />
        <p
          v-if="props.counter"
          class="t-text-base t-ml-auto t-mr-4 t-flex t-justify-end t-p-2"
          :class="[overTextLimit ? 't-text-critical' : 't-text-inactive']"
        >
          {{ inputValue?.length }}/{{ maxlength }}
        </p>
      </div>
      <div v-if="slots.bottom">
        <slot
          name="bottom"
          :input-value="(inputValue as string)"
        />
      </div>
    </div>
  </div>
</template>
