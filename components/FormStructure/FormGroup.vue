<script setup lang="ts">
import type { Field } from '~/types/Form/Field';


const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => [],
  },
  originValues: {
    type: Object as PropType<{ [key: string]: any }>,
    default: () => ({}),
  },
  fieldClassName: {
    type: String,
    default: 't-mb-6',
  },
});

const emit = defineEmits(['updateField', 'onBlur']);

const getNotfieldProps = (field: Field) => ({
  id: field.id || `field-${field.name}`,
  viewMode: field.viewMode,
  class: [
    props.fieldClassName,
    field.classNames,
  ]
    .filter(val => val)
    .join(' '),
});

const getFieldProps = (field: Field) => ({
  id: field.id || `field-${field.name}`,
  viewMode: field.viewMode,
  class: [props.fieldClassName, field.classNames]
    .filter(val => val)
    .join(' '),
  name: field.name,
  label: field.label,
  disabled: field.disabled,
  tooltip: field.tooltip,
  modelValue: props.originValues[field.name],
});

const getFieldOn = (field: Field) => ({
  'update:modelValue': (event: any) => {
    emit('updateField', event, field.name);
  },
  touched: field.onTouched,
});
</script>
<template>
  <div class="o-form">
    <template
      v-for="field in fields"
      :key="field.name"
    >
      <VFormInput
        v-if="field.fieldMode === 'input'"
        v-bind="getFieldProps(field)"
        :type="field.type"
        :behaviour-mode="field.behaviourMode"
        :unit="field.unit"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
        :counter="field.counter"
        :outer-func-btn="field.outerFuncBtn"
        @on-blur="(event) => emit('onBlur', event, field.name)"
        v-on="getFieldOn(field)"
      />
      <VFormTelInput
        v-else-if="field.fieldMode === 'tel'"
        v-bind="getFieldProps(field)"
        @validate="field.selfAction"
        v-on="getFieldOn(field)"
      />
      <VFormInputPassword
        v-else-if="field.fieldMode === 'inputPassword'"
        v-bind="getFieldProps(field)"
        :name="field.name"
        :autocomplete="field.autocomplete"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
        v-on="getFieldOn(field)"
      />
      <VFormInputPasswordRules
        v-else-if="field.fieldMode === 'inputPasswordRules'"
        v-bind="getFieldProps(field)"
        :placeholder="field.placeholder"
        :name="field.name"
        :maxlength="field.maxlength"
        :rules="field.rules"
        v-on="getFieldOn(field)"
      />
      <VFormOtpInput
        v-else-if="field.fieldMode === 'inputOtp'"
        v-bind="getFieldProps(field)"
        :maxlength="field.maxlength"
        :is-prefix-letter="field.isPrefixLetter"
        :disabled-prefix-letter="field.disabledPrefixLetter"
        v-on="getFieldOn(field)"
      />
      <VFormTextarea
        v-else-if="field.fieldMode === 'textarea'"
        v-bind="getFieldProps(field)"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
        :counter="field.counter"
        v-on="getFieldOn(field)"
      />
      <VFormDateSingle
        v-else-if="field.fieldMode === 'dateSingle'"
        v-bind="getFieldProps(field)"
        :min-date="field.minDate"
        :max-date="field.maxDate"
        v-on="getFieldOn(field)"
      />
      <VFormDateRange
        v-else-if="field.fieldMode === 'dateMultiple'"
        v-bind="getFieldProps(field)"
        :preset-ranges="field?.presetRanges"
        :presets-title="field?.presetTitle"
        :min-date="field.minDate"
        :max-date="field.maxDate"
        v-on="getFieldOn(field)"
      />
      <VFormSelect
        v-else-if="field.fieldMode === 'select'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        :placeholder="field.placeholder"
        v-on="getFieldOn(field)"
      />
      <VFormSelectAccount
        v-else-if="field.fieldMode === 'selectWallet'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        :placeholder="field.placeholder"
        v-on="getFieldOn(field)"
      />
      <VFormSelectCountry
        v-else-if="field.fieldMode === 'selectCountry'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        :placeholder="field.placeholder"
        v-on="getFieldOn(field)"
      />
      <VFormSelectTransferType
        v-else-if="field.fieldMode === 'selectTransferType'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        :placeholder="field.placeholder"
        v-on="getFieldOn(field)"
      />
      <VFormRadio
        v-else-if="field.fieldMode === 'radio'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        item-label-mode="default"
        v-on="getFieldOn(field)"
      />
      <VFormRadio
        v-else-if="field.fieldMode === 'radioBadge'"
        v-bind="getFieldProps(field)"
        :options="field.options"
        item-label-mode="badge"
        v-on="getFieldOn(field)"
      />
      <VFormFileAutoupload
        v-else-if="field.fieldMode === 'fileAutoupload'"
        v-bind="getFieldProps(field)"
        :preset="field.preset"
        :text-format="field.textFormat"
        v-on="getFieldOn(field)"
      />
      <VFormSwitch
        v-else-if="field.fieldMode === 'switch'"
        v-bind="getFieldProps(field)"
        v-on="getFieldOn(field)"
      />
      <VFormBasicCheckbox
        v-else-if="field.fieldMode === 'checkbox'"
        v-bind="getFieldProps(field)"
        v-on="getFieldOn(field)"
      />
      <VFormParty
        v-else-if="field.fieldMode === 'party'"
        v-bind="getFieldProps(field)"
        :wallet-type="field.walletType"
        v-on="getFieldOn(field)"
      />
      <DataInfoList
        v-else-if="field.fieldMode === 'nfList'"
        v-bind="getNotfieldProps(field)"
        :items="field.items"
        view-mode="limited"
      />
      <p
        v-else-if="field.fieldMode === 'nfText'"
        v-htmlsafe="field.content"
        class="o-field"
        v-bind="getNotfieldProps(field)"
      />
      <SignMainMessage
        v-else-if="field.fieldMode === 'nfMessage'"
        :mode="field.mode"
        v-bind="getNotfieldProps(field)"
        :id-els-prefix="field.id"
        class="o-field"
      >
        {{ field.content }}
      </SignMainMessage>
      <DataSwap
        v-else-if="field.fieldMode === 'nfSwap'"
        class="o-field"
        v-bind="getNotfieldProps(field)"
        :action="field.content.action"
        :text="field.content.text"
      />
      <div
        v-else-if="field.fieldMode === 'nfBtn'"
        class="o-field"
        v-bind="getNotfieldProps(field)"
      >
        <VBtn
          :data-test="`${field.id}`"
          @click="field.content.action"
        >
          {{ field.content.text }}
        </VBtn>
      </div>
    </template>
  </div>
</template>
