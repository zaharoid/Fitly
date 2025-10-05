<script lang="ts" setup>

const props = defineProps({
  errorMessage: {
    type: String,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
  textClasses: {
    type: Array,
    default: () => [],
  },
  view: {
    type: String as PropType<'absolute'|'hide'|''>,
    default: '',
  },
  valid: {
    type: Boolean,
    default: false,
  },
  inputId: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <TransitionExpand>
    <div
      v-if="(!props.valid && props.errorMessage)
        || (props.valid && props.successMessage)"
      class="v-form-help-message"
      :class="{ [`v-form-help-message--${props.view}`]: props.view }"
    >
      <p
        class="t-text-base t-pt-2"
        :class="[
          valid ? 't-text-accent' : 't-text-critical',
          ...props.textClasses,
        ]"
        :data-message-for="props.inputId ? props.inputId : null"
      >
        {{ valid ? props.successMessage : props.errorMessage }}
      </p>
    </div>
  </TransitionExpand>
</template>
<style lang="scss">
.v-form-help-message {

  &--absolute {
    @apply t-absolute t-inset-x-0 t-top-full;
  }

  &--hide {
    display: none;
  }
}
</style>
