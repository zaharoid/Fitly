<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: 'item-bell',
  },
  additionalText: {
    type: String,
    default: '',
  },
  count: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <button
    class="v-button-icon-count"
    :class="{ 'v-button-icon-count--active': props.isActive }"
  >
    <div class="t-w-max t-relative t-mx-auto">
      <i
        :class="`icon-${props.icon}`"
        class="t-text-xl"
      />
      <CountBadge
        :count="count"
        class="v-button-icon-count__badge t-text-base"
      />
    </div>
    <p
      v-if="additionalText"
      class="t-hidden md:t-block t-text-xs t-font-bold"
    >
      {{ additionalText }}
    </p>
  </button>
</template>
<style lang="scss">
.v-button-icon-count {
  $self: &;

  @apply t-rounded-md;
  color: theme('colors.secondaryText');
  min-height: 44px;
  min-width: 44px;
  position: relative;
  transition: background-color .2s ease;

  &__badge {
    position: absolute;
    right: theme('spacing.-1');
    top: -5px;
    transition: transform .2s ease;

    @screen md {
      right: theme('spacing.-3');
    }
  }

  &--active,
  &:hover {
    background-color: theme('colors.secondaryBackground');

    #{$self}__badge {
      transform: translateY(-4px);
    }
  }

}
</style>
