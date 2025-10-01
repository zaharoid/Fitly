<script setup lang="ts">

const props = defineProps({
  modelValueFrom: {
    type: [String, Number],
    default: '',
  },
  modelValueTo: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['update:modelValueFrom', 'update:modelValueTo']);

const valueFrom = ref(props.modelValueFrom);
const valueTo = ref(props.modelValueTo);

const handleUpdateFrom = (newValue: any) => {
  valueFrom.value = newValue;
  emit('update:modelValueFrom', newValue);
};

const handleUpdateTo = (newValue: any) => {
  valueTo.value = newValue;
  emit('update:modelValueTo', newValue);
};

</script>

<template>
  <div class="t-gap-3 t-flex">
    <VFormInput
      label="From"
      name="amount.from"
      :model-value="valueFrom"
      behaviour-mode="int"
      maxlength="13"
      placeholder="Minimum"
      @update:model-value="handleUpdateFrom"
    />

    <VFormInput
      label="To"
      name="amount.to"
      :model-value="valueTo"
      behaviour-mode="int"
      maxlength="13"
      placeholder="Maximum"
      @update:model-value="handleUpdateTo"
    />
  </div>
</template>
