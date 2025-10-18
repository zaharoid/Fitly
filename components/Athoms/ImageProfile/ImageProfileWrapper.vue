<script setup lang="ts">
import type { Image } from '~t/Image';
import ImageProfile from './ImageProfile.vue';

const props = defineProps({
  image: {
    type: Object as PropType<Image>,
    default: () => ({ url: '', alt: '' }),
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<'lg' | 'md' | 'sm'>,
    default: 'md',
  },
});

</script>
<template>
  <ImageProfile
    :fallback="{
      type: 'icon',
      iconName: 'user-main',
    }"
    :image="props.image"
    :title="props.title"
    :class="{ [`v-image-profile--${props.size}`]: props.size }"
  />
</template>
<style lang="scss">
.v-image-profile {

  &--lg {
    font-size: 44px;
    min-width: 96px;
    width: 96px;
  }

  &--md {
    font-size: 18px;
    min-width: 36px;
    width: 36px;
  }

  &--sm {
    font-size: 8px;
    min-width: 20px;
    width: 20px;
  }
}
</style>
