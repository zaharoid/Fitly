<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  tooltip: {
    type: Object as PropType<{ text?: string }>,
    default: () => ({}),
  },
  labelTag: {
    type: String as PropType<'label' | 'p'>,
    default: 'label',
  },
});
</script>
<template>
  <div v-if="props.label">
    <component
      :is="labelTag"
      v-htmlsafe="props.label"
      :for="labelTag === 'label' ? props.name : null"
      class="o-field__label"
    />
    <i
      v-if="props.label && props.tooltip.text"
      v-tooltip.right="props.tooltip.text"
      class="icon-item-circle-info t-text-secondaryText t-ml-1"
    />
  </div>
</template>
