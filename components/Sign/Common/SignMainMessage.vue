<script setup lang="ts">
const props = defineProps({
  mode: {
    type: String as PropType<'error'|'success'|'info'|'warning'>,
    default: 'error',
  },
  dataType: {
    type: String as PropType<'slot' | 'html'>,
    default: 'html',
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
});
const slots = useSlots();

</script>
<template>
  <div
    class="t-rounded-lg t-px-4 t-py-3 t-flex t-items-center"
    :class="{
      't-bg-criticalBg': props.mode === 'error',
      't-bg-accentBg': props.mode === 'success',
      't-bg-secondaryBackground': props.mode === 'info',
      't-bg-warningBg': props.mode === 'warning',
    }"
  >
    <i
      v-if="['error', 'success', 'info', 'warning'].includes(props.mode)"
      class="v-sign-message-i t-mr-3"
      :class="{
        'icon-action-cross t-bg-critical': props.mode === 'error',
        'icon-action-check-mark t-bg-accent': props.mode === 'success',
        'icon-item-info t-bg-secondaryItems': props.mode === 'info',
        'icon-item-info t-bg-warning': props.mode === 'warning',
      }"
    />
    <p
      v-if="dataType === 'html' && slots?.default"
      v-htmlsafe="slots?.default()[0].children"
      :data-test-id="`${idElsPrefix}${mode}-main-message`"
      class="t-text-base t-text-text t-grow t-self-center"
    />
    <p
      v-else
      :data-test-id="`${idElsPrefix}${mode}-main-message`"
      class="t-text-base t-text-text t-grow t-self-center"
    >
      <slot />
    </p>
  </div>
</template>

<style lang="scss">
.v-sign-message-i {
  align-items: center;
  border-radius: 16px;
  color: theme('colors.cards');
  display: flex;
  font-size: 6px;
  height: 16px;
  justify-content: center;
  margin-bottom: 3px;
  margin-top: 3px;
  min-width: 16px;
  width: 16px;
}
</style>
