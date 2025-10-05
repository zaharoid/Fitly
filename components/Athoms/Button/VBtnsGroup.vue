<script setup lang="ts">
import type { BtnItem } from '~t/Btn';

const props = defineProps({
  btns: {
    type: Array as PropType<BtnItem[]>,
    default: () => [],
  },
  justify: {
    type: String as PropType<'start' | 'end' | 'center'>,
    default: 'end',
  },
  width: {
    type: String,
    default: 'inherit',
  },
  idElsPrefix: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div>
    <div
      class="t-flex t-flex-wrap t-content-start t--m-1 md:t--m-2"
      :class="{
        't-justify-start': justify === 'start',
        't-justify-end': justify === 'end',
        't-justify-center': justify === 'center',
      }"
    >
      <template
        v-for="btn in props.btns"
        :key="btn.id"
      >
        <VBtn
          :style="{width}"
          v-if="typeof btn.action === 'function' || btn.action === null || btn.action === undefined"
          :id="btn.id ? `${idElsPrefix}${btn.id}` : undefined"
          :view-mode="btn.viewMode"
          :icon="btn.icon"
          :data-test="`${btn.id}-${btn.title?.toLowerCase().split(' ').join('-')}`"
          :type="btn?.type || 'button'"
          :form="btn?.form"
          :disabled="btn?.disabled"
          class="t-m-1 md:t-m-2"
          @click="btn.action"
        >
          {{ btn.title }}
        </VBtn>
        <VLinkBtn
          v-if="typeof btn.action === 'string'"
          :id="`${idElsPrefix}${btn.id}`"
          :view-mode="btn.viewMode"
          :icon="btn.icon"
          class="t-m-1 md:t-m-2"
          :to="btn.action"
        >
          {{ btn.title }}
        </VLinkBtn>
      </template>
    </div>
  </div>
</template>
