<script setup lang="ts">
import type { IconStatus } from '~t/IconStatus';
const props = defineProps({
  status: {
    type: String as PropType<IconStatus>,
    default: 'allow',
  },
  size: {
    type: String as PropType<'' | 'small'>,
    default: '',
  },
});

const myClasses = computed(() => {
  switch (props.status) {
  case 'success':
    return { colorClass: 't-bg-accent t-text-white', iconClass: 'icon-action-check-mark' };
  case 'warning':
    return { colorClass: 't-bg-warning t-text-white', iconClass: 'icon-item-exclamation' };
  case 'error':
    return { colorClass: 't-bg-critical t-text-white', iconClass: 'icon-action-cross' };
  case 'waiting':
    return { colorClass: 't-bg-warning t-text-white', iconClass: 'icon-item-arrow-clock' };
  case 'closed':
    return { colorClass: 't-bg-inactive t-text-white', iconClass: 'icon-action-cross' };
  case 'error-info':
    return { colorClass: 't-bg-critical t-text-white', iconClass: 'icon-item-exclamation' };
  default:
    return { colorClass: 't-bg-accent t-text-white', iconClass: '' };
  }
});
</script>
<template>
  <i
    class="v-circle-icon-badge"
    :class="{
      [`v-circle-icon-badge--${props.size}`]: props.size,
      [myClasses.colorClass]: myClasses.colorClass,
      [myClasses.iconClass]: myClasses.iconClass,
    }"
  />
</template>
<style lang="scss">
.v-circle-icon-badge {
  align-items: center;
  border-radius: 16px;
  display: flex;
  font-size: 8px;
  height: 16px;
  justify-content: center;
  min-width: 16px;
  width: 16px;

  &--small {
    font-size: 6px;
    height: 8px;
    min-width: 8px;
    width: 8px;
  }
}
</style>
