<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String as PropType<'h1'|'h2'|'h3'|'p'>,
    default: 'h1',
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
  prevBtn: {
    type: [String, Function] as PropType<string | ((...args: unknown[]) => void) | null>,
    default: null,
  },
  classIndent: {
    type: String,
    default: 't-mb-6',
  },
});
</script>
<template>
  <div
    class="v-sign-title"
    :class="[classIndent]"
  >
    <button
      v-if="typeof props.prevBtn === 'function'"
      :id="`${props.idElsPrefix}prevbtn`"
      class="icon-arrow-left v-sign-title__arrow"
      @click="props.prevBtn"
    />
    <NuxtLink
      v-if="typeof props.prevBtn === 'string'"
      :id="`${props.idElsPrefix}prevbtn`"
      class="icon-arrow-left v-sign-title__arrow"
      :to="props.prevBtn"
    />
    <component
      :is="props.tag"
      class="u-heading u-heading--3 v-sign-title__text"
      :class="[ props.prevBtn ? 't-text-left' : 't-text-center lg:t-text-left' ]"
    >
      <span>
        <slot />
      </span>
    </component>
  </div>
</template>
<style lang="scss">
.v-sign-title {
  align-items: flex-start;
  display: flex;

  &__arrow {
    color: theme('colors.secondaryText');
    font-size: 13px;
    margin-right: theme('spacing.4');
    padding: theme('spacing.3') theme('spacing.2') theme('spacing.1');
  }

  &__text {
    flex-grow: 1;
  }
}
</style>
