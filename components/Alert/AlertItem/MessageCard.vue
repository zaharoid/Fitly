<script setup lang="ts">
import type { AlertColorMode } from '~t/AlertColorMode';

const props = defineProps({
  mode: {
    type: String as PropType<AlertColorMode>,
    default: 'info',
  },
  title: {
    type: String,
    default: 'title',
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  isGhost: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['close']);

const modeProperties = computed(() => {
  switch (props.mode) {
  case 'info':
    return { bgColor: 't-bg-secondaryItems', icon: 'icon-item-circle-info' };
  case 'warning':
    return { bgColor: 't-bg-warning', icon: 'icon-item-circle-exclamation' };
  case 'danger':
    return { bgColor: 't-bg-critical', icon: 'icon-item-circle-cross' };
  case 'success':
    return { bgColor: 't-bg-accent', icon: 'icon-action-check-mark' };
  default:
    return { bgColor: 't-bg-secondaryText', icon: 'icon-item-circle-info' };
  }
});
</script>
<template>
  <div
    class="v-message-card"
    :class="{
      [modeProperties.bgColor]: modeProperties.bgColor,
      'v-message-card--ghost': props.isGhost,
    }"
  >
    <i
      class="t-text-white t-mr-3"
      :class="modeProperties.icon"
    />
    <div class="t-grow t-break-words t-overflow-hidden">
      <p
        v-htmlsafe="title"
        class="t-text-white"
      />
    </div>
    <button
      v-if="showCloseButton"
      class="v-message-card__close-btn o-iconed-btn o-iconed-btn--light icon-action-cross t-ml-3"
      @click="$emit('close')"
    />
  </div>
</template>

<style lang="scss">
.v-message-card {
  align-items: center;
  border-radius: theme('spacing.2');
  display: flex;
  padding: theme('spacing.3');
  position: relative;

  &__close-btn {
    color: theme('colors.white');
    height: 32px;
    min-width: 32px;
    width: 32px;
    z-index: theme('zIndex.base');
  }

  &:after {
    background-image: linear-gradient(180deg, theme('colors.background') 0%, #{theme('colors.background')}00 100%);
    border-radius: theme('spacing.2');
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform .2s ease;
  }

  &--ghost:after {
    transform: scaleY(1);
  }
}
</style>
