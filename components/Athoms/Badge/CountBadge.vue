<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});

const displayCount = computed(() => {
  return props.count > 99 ? '99+' : props.count;
});
</script>

<template>
  <div
    v-if="displayCount"
    class="v-count-badge"
  >
    {{ displayCount }}
  </div>
</template>

<style lang="scss">
.v-count-badge {
  @apply t-text-xs t-rounded-md;
  background: theme('colors.critical');
  color: theme('colors.white');
  font-weight: 500;
  padding-left: theme('spacing.1');
  padding-right: theme('spacing.1');
  text-align: center;
  width: max-content;

  @screen md {
    @apply t-text-sm;
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
