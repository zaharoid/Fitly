<script setup lang="ts">
import type { Image } from '~t/Image';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  classNames: {
    type: String,
    default: '',
  },
  img: {
    type: Object as PropType<Image>,
    default: null,
  },
  size: {
    type: String as PropType<'default' | 'small'>,
    default: 'default',
  },
  iconSize: {
    type: String as PropType<'half' | 'full'>,
    default: 'half',
  },
});
</script>
<template>
  <div
    class="o-circle-badge"
    :class="{
      [`o-circle-badge--size-${props.size}`]: props.size,
      [`o-circle-badge--icon-size-${props.iconSize}`]: props.iconSize,
      'o-circle-badge--with-img': props.img,
      [props.classNames]: props.classNames,
    }"
  >
    <i
      v-if="props.icon"
      :class="[`icon-${props.icon}`]"
    />
    <img
      v-if="props.img && props.img.url"
      :src="props.img.url"
      :alt="props.img.alt"
      class="o-circle-badge__img"
    >
  </div>
</template>
