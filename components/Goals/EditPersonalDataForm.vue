<script lang="ts" setup>
import * as Yup from 'yup';
import type { Field } from '~/types/Form/Field';
import type { FValues } from '~/types/Form/FValues';

const props = defineProps({
  originData: {
    type: Object as PropType<FValues>,
    default: () => {},
  }
});

const fields: Field[] = [
  {
    label: 'Gender',
    name: 'sex',
    fieldMode: 'radio',
    options: [
      { title: 'Male', id: 'm' },
      { title: 'Female', id: 'f' },
    ]
  }, {
    label: 'Height (см)',
    name: 'heightCm',
    type: 'number',
    fieldMode: 'input'
  }, {
    label: 'Weight (kg)',
    name: 'weightKg',
    type: 'number',
    fieldMode: 'input'
  }, {
    label: 'Age',
    name: 'age',
    type: 'number',
    fieldMode: 'input'
  },
]

watch(() => props.originData, (newVal) => {
  console.log('Origin data changed:', newVal);
}, { immediate: true });

</script>

<template>

<FormGroup
  :fields="fields"
  :origin-values="originData || {}"
/>
</template>