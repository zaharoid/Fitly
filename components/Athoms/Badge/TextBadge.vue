<script setup lang="ts">

const props = defineProps({
  colorMode: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div
    class="v-text-badge"
    :class="{ [`v-text-badge--${props.colorMode}`]: props.colorMode }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.v-text-badge {
  @apply t-text-sm;
  align-items: center;
  background-color: theme('colors.secondaryText');
  border-radius: 6px;
  color: theme('colors.white');
  display: inline-flex;
  font-weight: 500;
  padding: 0 6px;
  text-align: center;
  width: max-content;

  &--secondaryItems {
    background-color: theme('colors.secondaryItems');
  }

  &--warning {
    background-color: theme('colors.warning');
  }

  &--critical {
    background-color: theme('colors.critical');
  }

  &--accent {
    background-color: theme('colors.accent');
  }

  &--mediumStateBlue {
    background-color: theme('colors.mediumStateBlue');
  }

  &--semi {
    background-color: #{theme('colors.secondaryText')}33;
    color: theme('colors.text');
  }

  &--semi-secondaryItems {
    background-color: #{theme('colors.secondaryItems')}33;
    color: theme('colors.secondaryItems');
  }

  &--semi-warning {
    background-color: #{theme('colors.warning')}33;
    color: theme('colors.warning');
  }

  &--semi-critical {
    background-color: #{theme('colors.critical')}33;
    color: theme('colors.criticalPressed');
  }

  &--semi-accent {
    background-color: #{theme('colors.accent')}33;
    color: theme('colors.accentPressed');
  }

  &--fuchsia {
    background-color: theme('colors.fuchsia');
  }
}
</style>
