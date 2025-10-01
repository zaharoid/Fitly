<script setup lang="ts">
import commonProps from './commonProps';
import commonSelectProps from './commonSelectProps';

const props = defineProps({
  ...commonProps,
  ...commonSelectProps,
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
});
defineEmits(['update:modelValue', 'touched']);
</script>
<template>
  <VFormSelect
    v-bind="props"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('touched', $event)"
  >
    <template #singleLabel="slotProps">
      <div class="v-country-option">
        <div class="v-country-option__img-wrap">
          <img
            :src="slotProps.option.flag"
            :alt="slotProps.option.code"
            class="v-country-option__img"
          >
        </div>
        <span class="v-country-option__title">
          {{ slotProps.shortLabel }}
        </span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="v-country-option">
        <div class="v-country-option__img-wrap">
          <img
            :src="slotProps.option.flag"
            :alt="slotProps.option.code"
            class="v-country-option__img"
          >
        </div>
        <span class="v-country-option__title">
          {{ slotProps.option.title }}
        </span>
      </div>
    </template>
  </VFormSelect>
</template>
<style lang="scss">
.v-country-option {
  align-items: flex-start;
  display: flex;

  &__img-wrap {
    border-radius: 22px;
    height: 0;
    height: 22px;
    margin-right: theme('spacing.2');
    min-width: 22px;
    overflow: hidden;
    padding-left: 11px;
    position: relative;
    width: 22px;
  }

  &__img {
    height: 100%;
    max-width: none;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
  }

  &__title {
    flex-grow: 1;
  }
}
</style>
