<script lang="ts" setup>
function enter(el: Element) {
  const element = el as HTMLElement;
  const { width } = getComputedStyle(element);

  element.style.width = width;
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.height = 'auto';

  const { height } = getComputedStyle(element);

  element.style.width = '';
  element.style.position = '';
  element.style.visibility = '';
  element.style.height = '0';

  requestAnimationFrame(() => {
    element.style.height = height;
  });
}

function afterEnter(el: Element) {
  const element = el as HTMLElement;
  if (!element.style) return;
  element.style.height = 'auto';
}

function leave(el: Element, done: () => void) {
  const element = el as HTMLElement;
  const { height } = getComputedStyle(element);
  element.style.height = height;

  requestAnimationFrame(() => {
    element.style.height = '0';
    setTimeout(done, 200); // Ensure `done` is called after the transition duration
  });
}
</script>
<template>
  <transition
    name="v-transition-expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>
<style lang="scss">
.v-transition-expand {

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition: height .2s linear;
  }

  &-enter-from,
  &-leave-to {
    height: 0;
  }
}

// * {
//     backface-visibility: hidden;
//     perspective: 1000px;
//     transform: translateZ(0);
//     will-change: height;
// }
</style>
