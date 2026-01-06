<script setup lang="ts">
const props = defineProps({
  action: {
    type: Function,
    default: () => {},
  },
  id: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div class="t-flex t-flex-row v-data-swap">
    <VBtn
      :icon="{
        name: 'item-exchange',
        sizeClass: 't-text-xs t-rotate-90',
      }"
      class="t-p-2 t-min-w-[34px]"
      view-mode="secondary"
      :data-test="`field-${props.id}`"
      @click="props.action"
    />
    <TextBadge
      v-if="props.text"
      color-mode="semi-secondaryItems"
      class="t-px-1 t-ml-4 v-data-swap__badge"
    >
      {{ props.text }}
    </TextBadge>
  </div>
</template>
<style lang="scss">
.v-data-swap {

  &__badge {
    padding-left: theme('spacing.2');
    padding-right: theme('spacing.2');
  }
}
</style>
