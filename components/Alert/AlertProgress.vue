<script setup lang="ts">
const props = defineProps({
  total: {
    type: Number,
    default: 500,
  },
  val: {
    type: Number,
    default: 500,
  },
  transitionDuration: {
    type: Number,
    default: 500,
  },
});

const precent = computed(() => (props.val - props.transitionDuration) / (props.total - props.transitionDuration));
const transitionDurationSec = computed(() => props.transitionDuration ? `${props.transitionDuration / 1000}s` : undefined);
</script>
<template>
  <div class="v-alert-progress">
    <div
      class="v-alert-progress__indicator"
      :style="{
        transitionDuration: transitionDurationSec,
        transform: `scaleX(${precent})`,
      }"
    />
  </div>
</template>

<style lang="scss">
.v-alert-progress {
  background-color: theme('colors.secondaryBackground');
  border-radius: 2px;
  height: 2px;

  &__indicator {
    background-color: #{theme('colors.secondaryItems')}99;
    border-radius: 2px;
    height: 100%;
    transform-origin: left;
    transition-property: transform;
    transition-timing-function: linear;
    width: 100%;
  }
}
</style>
