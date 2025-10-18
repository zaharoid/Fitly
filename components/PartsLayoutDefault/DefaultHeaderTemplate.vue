<script setup lang="ts">
import { LINK_DASHBOARD } from '~/entries/pageLinks';

const props = defineProps({
  isShadow: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <header
    class="v-default-header t-bg-white t-z-navbar"
    :class="{ 'v-default-header--shadow': props.isShadow }"
  >
    <div class="v-default-header__tools">
      <slot />
    </div>
  </header>
</template>

<style lang="scss">
.v-default-header {
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 52px;
  justify-content: space-between;
  padding-left: theme('spacing.4');
  padding-right: theme('spacing.4');
  position: fixed;
  top: 0;
  width: 100vw;

  &--shadow {
    box-shadow: 0 6px 6px 0 theme('colors.background');
  }

  @screen lg {
    height: 70px;
    padding-left: theme('spacing.6');
    padding-right: theme('spacing.6');
  }

  &__tools {
    align-items: center;
    display: flex;
    position: relative;
    width: 100%;
  }
}
</style>
