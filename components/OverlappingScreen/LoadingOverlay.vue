<script lang="ts" setup>
const props = defineProps({
  overlay: {
    type: String as PropType<'solid'|'semi'>,
    default: null,
  },
  mode: {
    type: String as PropType<'tab'|'full-absolute'|'full-fixed'>,
    default: null,
  },
});
</script>
<template>
  <div
    class="v-loading-overlay"
    :class="{
      [`v-loading-overlay--overlay-${props.overlay}`]: props.overlay,
      [`v-loading-overlay--mode-${props.mode}`]: props.mode,
    }"
  >
    <div class="v-loading-overlay__filling">
      <EllipsisAnimated class="v-loading-overlay__i" />
    </div>
  </div>
</template>
<style lang="scss">
.v-loading-overlay {
  $self: &;

  @apply t-z-rearOverlay;
  display: flex;

  &__filling {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
  }

  &__i {
    margin: auto;
    width: 100px;
  }

  &--overlay {

    &-solid {
      background-color: theme('colors.background');
    }

    &-semi {
      background-color: theme('colors.background') + '99';
    }
  }

  &--mode {

    &-tab {
      height: 50vh;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    &-full-absolute {
      height: 100%;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;

      #{$self}__filling {
        max-height: 70vh;
      }
    }

    &-full-fixed {
      @apply t-z-overlay;
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }
  }
}
</style>
