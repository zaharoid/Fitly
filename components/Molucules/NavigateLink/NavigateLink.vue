<script setup lang="ts">
import { useIsActiveLink } from '~/compasables/useIsActiveLink';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  count: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: 'Title',
  },
  path: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  exact: {
    type: Boolean,
    default: false,
  },
  focus: {
    type: Boolean,
  },
  action: {
    type: Function,
    default: undefined,
  },
});
const emit = defineEmits(['click']);

const componentType = computed(() => {
  if (props.path?.startsWith('/')) return resolveComponent('NuxtLink');
  if (props?.action) return resolveComponent('VBtn');
  return 'a';
});

const linkProps = computed(() => {
  if (props.disabled) {
    return {};
  } else if (props.path.startsWith('/')) {
    return { to: props.path, activeClass: 'v-navigate-link__active' };
  }
  return { href: props.path };
});

function onClick (e: Event) {
  if (props.disabled) return null;
  if (props.action) {
    props.action();
  }
  return emit('click', e);
}
</script>

<template>
  <component
    :is="componentType"
    v-bind="linkProps"
    :disabled="props.disabled"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    class="v-navigate-link"
    :class="{'v-navigate-link__active': props.exact ? false : useIsActiveLink($el) }"
    @click="onClick"
  >
    <span class="t-flex t-gap-[16px] t-items-center">
      <i :class="`icon-${props.icon}`" />
      <span class="v-navigate-link__text"> {{ props.title }}</span>
    </span>
    <CountBadge :count="props.count" />
  </component>
</template>

<style scoped lang="scss">
.v-navigate-link {
  align-items: center;
  background: theme('colors.cards');
  border: 1px solid theme('colors.cards');
  border-radius: 8px;
  color: theme('colors.secondaryText');
  display: flex;
  gap: 12px;
  justify-content: space-between;
  min-height: 54px;
  padding: 0 16px;
  transition: background .3s ease !important;
  width: 100%;

  &:focus-visible {
    border: 1px solid theme('colors.secondaryItems');
    box-shadow: 0 0 0 2px theme('colors.secondaryItems');
  }

  &__active {
    background: theme('colors.secondaryBackground');
    color: theme('colors.secondaryItems');
  }

  &__text {
    /* stylelint-disable */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* stylelint-enable */
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: theme('colors.background');
    color: theme('colors.secondaryItems');
  }

  &[disabled='true'] {
    background: theme('colors.cards') !important;
    color: theme('colors.inactive') !important;
  }
}
</style>
