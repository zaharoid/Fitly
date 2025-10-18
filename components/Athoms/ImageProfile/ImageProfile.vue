<script setup lang="ts">
import type { Image } from '~t/Image';

type Fallback = {
  className?: string; type: 'icon'; iconName: string;
} | {
  className?: string; type: 'title';
};

const props = defineProps({
  image: {
    type: Object as PropType<Image>,
    default: null,
  },
  fallback: {
    type: Object as PropType<Fallback>,
    default: () => ({
      className: '', type: 'icon', iconName: 'user-main',
    }),
  },
  title: {
    type: String,
    default: '',
  },
});

const isError = ref(false);

function getTitleFallback (text: string) {
  if (!text) return '';
  return text
    .split(/\s+/)
    .map((word: string) => word.slice(0, 1))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const fallbackClassName = computed(() => (
  props.fallback.className || 't-text-cards t-bg-secondaryItems'
));
const fallbackTitle = computed(() => getTitleFallback(props.title));

watch(() => props.image?.url, () => { isError.value = false; });
function onError () { isError.value = true; }

const showImg = computed(() => (props.image?.url && !isError.value));
const imgEl = ref(null);
</script>
<template>
  <div class="v-image-profile-free">
    <div class="v-image-profile-free__wrapper">
      <ClientOnly>
        <div class="v-image-profile-free__inner">
          <img
            v-if="showImg"
            ref="imgEl"
            class="v-image-profile-free__img"
            :src="props.image.url"
            :alt="props.image.alt"
            :title="props.title"
            @error="onError"
          >
          <span
            v-if="!showImg && props.fallback.type === 'title'"
            class="v-image-profile-free__placer"
            :class="fallbackClassName"
            :title="props.title"
          >
            {{ fallbackTitle }}
          </span>
          <span
            v-else-if="!showImg && props.fallback.type === 'icon'"
            class="v-image-profile-free__placer"
            :title="props.title"
            :class="[
              fallbackClassName,
              { [`icon-${props.fallback.iconName}`]: props.fallback.iconName },
            ]"
          />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
<style lang="scss">
.v-image-profile-free {
  border-radius: 50%;
  overflow: hidden;

  &__wrapper {
    height: 0;
    padding-bottom: 100%;
    position: relative;
    width: 100%;
  }

  &__inner {
    display: flex;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  &__img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  &__placer {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
}
</style>
