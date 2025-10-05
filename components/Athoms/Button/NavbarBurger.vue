<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{(e: 'update:isOpen', val: boolean): void}>();
const isOpenLocal = ref(false);
watch(
  () => props.isOpen,
  (val) => { isOpenLocal.value = val; },
  { immediate: true },
);

function toggle () {
  isOpenLocal.value = !isOpenLocal.value;
  emit('update:isOpen', isOpenLocal.value);
}
</script>

<template>
  <button
    class="v-navbar-burger t-rounded-md"
    :class="{ 'v-navbar-burger--active': isOpenLocal }"
    :aria-expanded="isOpenLocal ? 'true' : 'false'"
    @click="toggle"
  >
    <div class="v-navbar-burger__inner">
      <span class="v-navbar-burger__item" />
      <span class="v-navbar-burger__item" />
      <span class="v-navbar-burger__item" />
    </div>
  </button>
</template>

<style lang="scss">
.v-navbar-burger {
  $self: &;
  $line_gap: 9px;
  $line_weight: 3px;
  background-color: theme('colors.white');
  border: 0 solid theme('colors.secondaryText');
  padding: 11.5px;
  transition: background .3s ease;
  z-index: theme('zIndex.base');

  &--active,
  &:hover {
    background-color: theme('colors.secondaryBackground');
  }

  &__inner {
    cursor: pointer;
    height: $line_gap * 2 + $line_weight;
    position: relative;
    transform: rotate(0deg);
    transition: .5s ease-in-out;
    width: $line_gap * 2 + $line_weight;
  }

  &__item {
    background-color: theme('colors.secondaryText');
    display: block;
    height: 3px;
    left: 0;
    opacity: 1;
    position: absolute;
    transform-origin: center center;
    transition: transform .3s ease;
    width: 100%;

    &:nth-child(1) {
      top: 0;
    }

    &:nth-child(2) {
      top: $line_gap;
    }

    &:nth-child(3) {
      top: $line_gap * 2;
    }
  }

  &--active {
    #{$self}__item:nth-child(1) {
      transform: translateY($line_gap) rotate(45deg);
    }

    #{$self}__item:nth-child(2) {
      transform: scaleX(0);
    }

    #{$self}__item:nth-child(3) {
      transform: translateY(-$line_gap) rotate(-45deg);
    }
  }
}
</style>
