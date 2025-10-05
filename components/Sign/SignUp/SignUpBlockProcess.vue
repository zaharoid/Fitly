<script setup lang="ts">
import useCommonProcessFunc from '../Common/useCommonProcessFunc';
import { dateApi } from '~m/fieldsToBackendMappers';
import { LINK_DASHBOARD } from '~/entries/pageLinks';

const props = defineProps({
  idElsPrefix: {
    type: String,
    default: '',
  },
});

const STEPS_ID = {
  PERSONAL: 'personal',
  VERIFY: 'verify_phone',
  PASS: 'password',
};
const steps = [
  {
    id: STEPS_ID.PERSONAL,
    title: 'Personal info',
    secondTitle: 'Fill in information about yourself',
  }, {
    id: STEPS_ID.VERIFY,
    title: 'Verify phone number',
    secondTitle: 'Verify phone number',
  }, {
    id: STEPS_ID.PASS,
    title: 'Create password',
    secondTitle: 'Create a strong password',
  },
];

const route = useRoute();

const { $ufetch } = useNuxtApp();

const personalPartErrors = ref({});

// requests

function requestCheckPhone (phoneNumber: string) {
  return $ufetch(useUri().auth.signup.checkPhone(), {
    method: 'post',
    ignoreResponseError: true,
    body: {
      code: route.params.id,
      phoneNumber,
    },
  });
}

function requestCheckSMS (smsCode: string) {
  return $ufetch<{ message: string }>(useUri().auth.signup.checkSms(), {
    method: 'post',
    ignoreResponseError: true,
    body: {
      code: route.params.id,
      smsCode,
    },
  });
}

// -/end- requests

const {
  activeStepId,
  activeStep,
  allFieldsVal,
  addFieldsVal,
  prevBtn,
  setShiftStepId,
  mainError,
  otpFirstLetter,
  loading,
  phoneMapper,
  otpCodeMapper,
  actionCheckPhone,
  resendBtn,
} = useCommonProcessFunc({
  originStepId: STEPS_ID.PERSONAL,
  steps,
  actionResendBtn,
});

function actionResendBtn () {
  return actionCheckPhone({
    promiseCheckPhone: () => requestCheckPhone(phoneMapper(allFieldsVal.value?.phoneNumber)),
    onError (mes: string) {
      mainError.value = mes;
    },
  });
}

function mapperSend (vals: any) {
  return {
    emailCode: route.params.id,
    firstName: vals.name,
    lastName: vals.surname,
    birthDate: dateApi(vals.birthday),
    mainCountry: vals.primaryCountry,
    phoneNumber: phoneMapper(vals.phoneNumber),
    smsCode: otpCodeMapper(vals.smsCode),
    password: vals.password,
    concern: vals.concern,
  };
}

const countryStore = useCountryStore();
countryStore.setQueryParams({ purpose: 'sms' });

function onSubmitPersonal (vals: any) {
  actionCheckPhone({
    promiseCheckPhone: () => requestCheckPhone(phoneMapper(vals.phoneNumber)),
    onSuccess: () => {
      setShiftStepId(1);
      addFieldsVal(vals);
    },
    onError (mes: string) {
      personalPartErrors.value = { phoneNumber: mes };
    },
  });
}

async function onSubmitPhoneVerify (vals: any) {
  loading.value = true;
  const res = await requestCheckSMS(otpCodeMapper(vals.smsCode));
  loading.value = false;
  if (res.message === 'ok') {
    setShiftStepId(1);
    addFieldsVal(vals);
  } else {
    mainError.value = 'Wrong sms code';
  }
}

async function onSubmitFinal (vals: any) {
  mainError.value = '';
  addFieldsVal(vals);
  const res = await useRequestRegistration(mapperSend(allFieldsVal.value));
  if (res?.data?.profile) {
    navigateTo(LINK_DASHBOARD());
    countryStore.setQueryParams({});
  } else {
    mainError.value = res?.message || '';
  }
}
</script>
<template>
  <div>
    <StepsProgress
      v-model="activeStepId"
      :items="steps"
      :id-els-prefix="props.idElsPrefix"
      is-compact-mode
      class="t-mb-6"
    />
    <SignHeading
      :id-els-prefix="props.idElsPrefix"
      :prev-btn="prevBtn"
    >
      {{ activeStep?.secondTitle }}
    </SignHeading>
    <SignMainMessage
      v-if="mainError"
      :id-els-prefix="props.idElsPrefix"
      class="t-mb-6"
    >
      {{ mainError }}
    </SignMainMessage>
    <div>
      <SignUpPartPersonal
        v-show="activeStepId === STEPS_ID.PERSONAL"
        :id-els-prefix="props.idElsPrefix"
        :outer-errors="personalPartErrors"
        :countries-options="countryStore.countriesOptions"
        :loading="loading"
        @submit="onSubmitPersonal"
      />
      <SignUpPartPhoneVerify
        v-show="activeStepId === STEPS_ID.VERIFY"
        :id-els-prefix="props.idElsPrefix"
        :phone="allFieldsVal?.phoneNumber"
        :first-letter="otpFirstLetter"
        :loading="loading"
        :resend-btn="resendBtn"
        @submit="onSubmitPhoneVerify"
      />
      <SignUpPartPassword
        v-show="activeStepId === STEPS_ID.PASS"
        :id-els-prefix="props.idElsPrefix"
        :loading="loading"
        @submit="onSubmitFinal"
      />
    </div>
  </div>
</template>
