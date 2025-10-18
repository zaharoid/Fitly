<script setup lang="ts">
import type { AlertColorMode } from '~t/AlertColorMode';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  mode: {
    type: String as PropType<AlertColorMode>,
    default: 'info',
  },
});

const colorMode = computed(() => {
  switch (props.mode) {
  case 'info':
    return 'secondaryItems';
  case 'warning':
    return 'warning';
  case 'danger':
    return 'critical';
  case 'success':
    return 'accent';
  default:
    return '';
  }
});
</script>

<template>
  <TextBadge :color-mode="colorMode">
    <slot />
  </TextBadge>
</template>
