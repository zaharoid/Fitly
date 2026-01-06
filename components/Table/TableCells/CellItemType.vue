<script setup lang="ts">
const props = defineProps({
  badge: {
    type: Object,
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
  isBigTitle: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div
    v-if="props.badge || props.title"
    class="t-flex t-items-center"
  >
    <CircleBadge
      v-if="props.badge"
      v-bind="props.badge"
      class="t-mr-2"
    />
    <p
      v-if="props.title"
      v-htmlsafe="props.title"
      :class="[ props.isBigTitle ? 't-font-semibold t-text-base' : 't-font-medium t-text-sm' ]"
    />
  </div>
</template>
