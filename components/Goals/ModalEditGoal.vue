<script setup lang="ts">
import type { FormColField } from '~/types/Form/FormCustom';
import type { FValues } from '~/types/Form/FValues';


const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  formId: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  origin: {
    type: Object as PropType<FValues>,
    default: () => ({}),
  },
  fields: {
    type: Array as PropType<FormColField[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  'update:open': [boolean],
  'submit': [FValues],
}>();

const onOkModal = () => {
  emit('update:open', false);
};
function onSubmit (vals: FValues) {
  emit('submit', vals);
}

</script>
<template>
  <a-modal
    :title="props.title"
    width="900px"
    centered
    :open="props.open"
    :z-index="1001"
    @update:open="emit('update:open', $event)"
  >
    <a-divider />
    <a-spin tip="Loading..." :spinning="props.loading">
      <FormColFields
        :id="props.formId"
        :origin="props.origin"
        :reset="props.open"
        :fields="props.fields"
        @submit="onSubmit"
      />
    </a-spin>
    <template #footer>
      <a-button @click="onOkModal">
        Cancel
      </a-button>
      <a-button
        type="primary"
        html-type="submit"
        :form="props.formId"
      >
        Save
      </a-button>
    </template>
  </a-modal>
</template>
