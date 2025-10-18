<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string,
}>(), {
  to: '/',
});
</script>
<template>
  <NuxtLink
    class="v-logo-link"
    :to="props.to"
  >
    <SvgLogo class="v-logo-link__logo" />
  </NuxtLink>
</template>
<style lang="scss">
.v-logo-link {
  align-items: center;
  display: inline-flex;
  width: fit-content;

  &__logo {
    height: 28px;
    transition: width, height .3s ease;
    width: 51px;

    @screen md {
      height: 32px;
      width: 59px;
    }
  }

  &__title {
    height: 16px;
    margin-left: 12px;
    opacity: 0;
    transition-duration: .2s;
    transition-property: opacity, visibility, width;
    transition-timing-function: ease;
    visibility: hidden;
    width: 0;

    @screen md {
      opacity: 1;
      visibility: visible;
      width: 125px;
    }
  }
}
</style>
