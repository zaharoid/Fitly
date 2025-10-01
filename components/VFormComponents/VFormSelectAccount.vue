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
      <div class="v-account-option">
        <span class="v-account-option__title">
          {{ slotProps.shortLabel }}
        </span>
        <span>
          {{ slotProps.option.sideText }}
        </span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="v-account-option">
        <span class="v-account-option__title">
          {{ slotProps.option.title }}
        </span>
        <span class="t-text-secondaryText">
          {{ slotProps.option.sideText }}
        </span>
      </div>
    </template>
  </VFormSelect>
</template>

<style lang="scss">
.v-account-option {
  display: flex;
  gap: theme('spacing.1');
  justify-content: space-between;

  &__title {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @screen sm {
      max-width: 40%;
    }

    @screen xl {
      max-width: 25%;
    }

    @screen 2xl {
      max-width: 45%;
    }

  }
}
</style>
