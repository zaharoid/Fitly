<script setup lang="ts">
import type { Image } from '~t/Image';

const props = defineProps({
  image: {
    type: Object as PropType<Image>,
    default: undefined,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  textLimit: {
    type: Number,
    default: 55,
  },
  isTextFixed: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <div class="t-flex t-items-center">
    <ImageProfile
      :image="props.image"
      size="md"
      :title="props.title"
      class="t-mr-2"
    />
    <ClientOnly>
      <div
        class="t-grow t-overflow-hidden"
        :class="{
          't-break-all': !props.isTextFixed,
          't-whitespace-nowrap': props.isTextFixed,
        }"
      >
        <p
          v-if="props.title"
          v-htmlsafe="utilCutString(props.title, props.textLimit)"
          class="t-font-bold"
        />
        <p
          v-if="props.description"
          v-htmlsafe="utilCutString(props.description, props.textLimit)"
          class="t-text-greyNobel t-text-sm"
        />
      </div>
    </ClientOnly>
  </div>
</template>
