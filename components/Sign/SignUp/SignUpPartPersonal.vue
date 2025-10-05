<script setup lang="ts">
import * as Yup from 'yup';
import type { Field } from '~/types/Form/Field';
import type { OptionSelect } from '~/types/Form/Option';

const props = defineProps({
  outerErrors: {
    type: Object,
    default: () => ({}),
  },
  countriesOptions: {
    type: Array as PropType<OptionSelect[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
});

const { t } = useI18n();

const phoneSuccess = ref(true);
const termsIsAccepted = ref<boolean>(false);
const isSmsAgreement = ref<boolean>(false);
const fields = computed<Field[]>(() => [
  {
    name: 'name',
    label: 'First Name',
    fieldMode: 'input',
    placeholder: 'John',
    type: 'text',
    viewMode: 'half',
    maxlength: 50,
    validation: Yup.string()
      .required()
      .label('First Name')
      // @ts-ignore
      .ownName(),
  }, {
    name: 'surname',
    label: 'Last Name',
    fieldMode: 'input',
    placeholder: 'Doe',
    type: 'text',
    viewMode: 'half',
    maxlength: 50,
    validation: Yup
      .string()
      .label('Last Name')
      .required()
      // @ts-ignore
      .ownName(),
  }, {
    name: 'birthday',
    label: 'Date of Birth',
    fieldMode: 'dateSingle',
    maxDate: new Date(),
    validation: Yup.date(),
  }, {
    name: 'primaryCountry',
    label: 'Country of residence',
    fieldMode: 'selectCountry',
    options: props.countriesOptions,
    placeholder: 'Country',
    validation: Yup.string().required().label('Country of residence'),
  }, {
    name: 'phoneNumber',
    label: 'Phone number',
    fieldMode: 'tel',
    placeholder: '',
    classNames: 't-mb-6',
    selfAction: (data: any) => {
      phoneSuccess.value = Boolean(data.valid);
    },
    validation:
      Yup.string().required().label('Phone number').test(
        'phone', () => t('form_errors.invalid', { name: 'Phone number' }), () => phoneSuccess.value,
      ),
  }, {
    name: 'concern',
    label: 'I agree with <a data-test="terms-and-conditions-btn" class="t-text-secondaryItems" href="https://montowire.ca/terms-of-use/">terms and conditions</a> and <a data-test="privacy-policy-btn" class="t-text-secondaryItems" href="https://montowire.ca/privacy-policy/">privacy policy</a>',
    fieldMode: 'checkbox',
    placeholder: 'Terms',
    classNames: 't-mb-6',
  }, {
    name: 'receiveSmsAgreement',
    label: 'I agree to receive SMS based on my data',
    fieldMode: 'checkbox',
    classNames: 't-mb-6',
  },
]);

const emit = defineEmits<{(e: 'submit', event: Object): void}>();
function onSubmit (vals: any) {
  if (props.loading) return;
  emit('submit', vals);
}

const validationSchema = utilGetValidationSchema(fields.value);

const rootForm = ref<any>(null);
function setErrors (errorsObj: Object) {
  if (!rootForm.value) return;
  Object.entries(errorsObj).forEach(([key, val]) => {
    rootForm.value.setFieldTouched(key, true);
    rootForm.value.setFieldError(key, val);
  });
}

const onUpdateField = (val: any, name: string) => {
  if (name === 'concern') termsIsAccepted.value = val;
  if (name === 'receiveSmsAgreement') isSmsAgreement.value = val;
};

watch(() => props.outerErrors, setErrors);

const idFormPrefix = 'personal-';
</script>
<template>
  <VForm
    :id="`${props.idElsPrefix}${idFormPrefix}form`"
    ref="rootForm"
    :validation-schema="validationSchema"
    @submit="onSubmit"
  >
    <FormGroup
      :fields="fields"
      field-class-name="t-mb-4"
      @update-field="onUpdateField"
    />
    <VBtn
      :id="`${props.idElsPrefix}${idFormPrefix}submit`"
      class="t-w-full t-mt-4 t-mb-6"
      type="submit"
      :disabled="!termsIsAccepted || !isSmsAgreement || props.loading"
    >
      Continue
      <!-- !lang -->
    </VBtn>
    <p class="t-text-secondaryText t-text-sm t-text-center">
      By continue, you agree to receive informational messages at the phone number provided. Reply <br> STOP to cancel. Msg rates may apply.
    </p>
  </VForm>
</template>
