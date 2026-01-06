<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
});

const slots = useSlots();
</script>
<template>
  <div class="v-main-heading">
    <slot name="default">
      <h1 class="u-heading u-heading--2">
        {{ props.text }}
      </h1>
    </slot>
    <div
      v-if="slots.side"
      class="t-self-center"
    >
      <slot name="side" />
    </div>
  </div>
</template>

<style lang="scss">
.v-main-heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: theme('spacing.6');
  width: 100%;
}
</style>
