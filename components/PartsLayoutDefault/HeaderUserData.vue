<script lang="ts" setup>
import type { Image } from '~t/Image';

const props = defineProps({
  image: {
    type: Object as PropType<Image>,
    default: () => {},
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div class="t-flex t-items-center t-gap-1">
      <ImageProfileWrapper
      :image="props.image"
      :title="props.title"
    />
    <ProfileImageText
      class="t-grow t-pointer-events-none lg:t-flex"
      :image="props.image"
      :title="props.title"
      :description="props.description"
      :is-text-fixed="false"
    />
  </div>
</template>