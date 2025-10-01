<script setup lang="ts">
import useVFormCommon from './useVFormCommon';
import commonProps from './commonProps';

interface PropFuncBtn {
  text?: string,
  icon?: string,
  action: Function | { [key: string]: Function },
}

interface PropUnit {
  text?: string,
  icon?: string,
}

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
  unit: {
    type: Object as PropType<null | PropUnit>,
    default: null,
  },
});

type Emit = {
  (e: 'update:modelValue', val: string): void
  (e: 'onBlur', val: string): void
  (e: 'touched', val: boolean): void
}
const emit = defineEmits<Emit>();
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

const textarea = ref<HTMLTextAreaElement | null>(null);

const localFuncBtn = computed(() => {
  if (props.funcBtn === null) return null;
  const returnedObj = props.funcBtn;
  if (typeof returnedObj.action === 'function') {
    returnedObj.action = { click: returnedObj.action };
  }
  return returnedObj;
});

const overTextLimit = computed(() => inputValue.value.length > props.maxlength);

function resize () {
  const el = textarea.value;
  if (!el) return;
  el.style.height = 'auto';
  const newHeight = Math.min(204, el.scrollHeight);
  el.style.height = `${newHeight}px`;
}

function onChangeLocal (event: any) {
  resize();
  onChange(event);
}

function onBlurField () {
  resize();
  onBlur();
}

watch(() => props.modelValue, () => nextTick(resize));

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
      <div class="o-field__input">
        <!-- eslint-disable vuejs-accessibility/form-control-has-label -->
        <textarea
          :id="finalId"
          ref="textarea"
          class="o-input"
          :class="{
            'o-input--critical': isError,
            't-pr-16': localFuncBtn || unit,
          }"
          style="min-height: 60px;"
          :name="props.name"
          :type="props.type"
          :value="inputValue"
          :maxlength="counter ? undefined : String(props.maxlength)"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :data-error="errorMessage"
          @input="onChangeLocal"
          @blur="onBlurField"
        />
        <span />
        <!-- eslint-enable -->
        <div
          v-if="unit"
          class="o-field__unit"
        >
          <i :class="{ [`icon-${unit.icon}`]: unit.icon }" />
          <p v-if="unit.text">
            {{ unit.text }}
          </p>
        </div>
        <button
          v-if="localFuncBtn"
          type="button"
          class="o-field__func-btn"
          v-on="localFuncBtn?.action"
        >
          <i :class="{ [`icon-${localFuncBtn.icon}`]: localFuncBtn.icon }" />
          <span v-if="localFuncBtn.text">{{ localFuncBtn.text }}</span>
          <span v-if="!(localFuncBtn.text || localFuncBtn.icon)">Button</span>
        </button>
      </div>
      <div
        class="t-flex"
      >
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
          {{ inputValue.length }}/{{ maxlength }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.o-field__input {

  textarea.o-input {
    @apply t-text-base;
    background-color: theme('colors.cards');
    border: none;
    border-radius: .25rem;
    min-height: 60px;
    outline: none;
    padding: theme('spacing.2');
    position: relative;
    resize: none;

    @include placeholder-style {
      color: theme('colors.secondaryText');
    }

    + span {
      background-color: #{theme('colors.secondaryItems')}88;
      bottom: 0;
      display: block;
      height: 2px;
      left: theme('spacing.2');
      position: absolute;
      right: theme('spacing.2');
      transform: scaleX(0);
      transition: transform .2s ease;
    }

    &:focus + span {
      transform: scaleX(1);
    }
  }
}

</style>
