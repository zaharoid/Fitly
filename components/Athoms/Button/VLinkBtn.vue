<script setup lang="ts">
import type * as Btn from '~t/Btn';

type LinkTags = 'NuxtLink' | 'a';

const props = defineProps({
  to: {
    type: String,
    default: '',
  },
  tag: {
    type: String as PropType<LinkTags>,
    default: 'NuxtLink',
  },
  viewMode: {
    type: String as PropType<Btn.BtnViewMode>,
    default: '',
  },
  icon: {
    type: Object as PropType<{
      name: string,
      sizeClass?: string,
      position?: 'left'|'right',
    } | null>,
    default: null,
  },
});

defineEmits<{(e: 'click', event: Event): void}>();

const renderingComponent = computed(() => {
  if (props.tag === 'NuxtLink') {
    return resolveComponent('NuxtLink');
  }
  return props.tag;
});

</script>
<template>
  <component
    :is="renderingComponent"
    v-bind="props.tag === 'NuxtLink'
      ? { to }
      : { href: to }"
    class="o-btn"
    :class="{
      [`o-btn--${props.viewMode}`]: props.viewMode,
      'o-btn--i-right': icon?.position === 'right',
    }"
    @click="$emit('click', $event)"
  >
    <i
      v-if="icon?.name"
      class="o-btn__icon"
      :class="[
        `icon-${icon.name}`,
        icon.sizeClass ? icon.sizeClass : 't-text-sm',
      ]"
    />
    <span>
      <slot />
    </span>
  </component>
</template>
