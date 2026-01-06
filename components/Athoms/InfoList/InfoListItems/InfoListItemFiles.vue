<script setup lang="ts">
import type { FileItem } from '~t/FileItem';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array as PropType<FileItem[]>,
    default: () => [],
  },
});

const isShow = ref(false);

const isShowToggle = computed(() => !!props.items?.length);

function toggle () {
  if (!isShowToggle) {
    isShow.value = false;
    return;
  }
  isShow.value = !isShow.value;
}
</script>
<template>
  <div class="v-info-list-item-files t-flex t-flex-col t-items-start">
    <VBtn
      view-mode="ghost-secondary"
      class="v-info-list-item-files__toggle t-ml-[-5px]"
      :class="{ 'v-info-list-item-files__toggle--opened': isShow }"
      @click="toggle"
    >
      {{ props.title || 'show' }} <i
        v-if="isShowToggle"
        class="icon-arrow-bottom v-info-list-item-files__toggle__i"
      />
    </VBtn>
    <TransitionExpand>
      <DetailFileList
        v-if="isShow"
        :items="props.items"
      />
    </TransitionExpand>
  </div>
</template>
<style lang="scss">
.v-info-list-item-files {
  $self: &;

  &__toggle {
    color: theme('colors.text');

    &__i {
      font-size: 12px;
      margin-left: theme('spacing.1');

      &:before {
        display: inline-block;
        transition: transform .2s ease;
      }
    }
  }

  &__toggle--opened {

    #{$self}__toggle__i:before {
      transform: scaleY(-1);
    }
  }
}
</style>
