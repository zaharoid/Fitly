<script setup lang="ts">
import { useWindowSize } from '~/.nuxt/imports';
import type { InfoItem, DataInfoItem } from '~t/InfoList';

const props = defineProps({
  items: {
    type: Array as PropType<DataInfoItem[]>,
    default: () => [],
  },
});
const mappedItems = computed((): InfoItem[] => {
  return props.items.map((item) => {
    let sizeClass = 't-text-base';
    const { view, ...other } = item;
    if (view === 'xl') sizeClass = 't-text-xl';

    return {
      ...other,
      view: undefined,
      description: item.description || 'No data',
      classNames: item.description
        ? `${sizeClass} t-text-base t-font-bold`
        : `${sizeClass} t-text-inactive t-font-normal`,
    };
  });
});

const { width } = useWindowSize();

const tooltipDirection = computed(() => {
  if (width.value > 1100) return 'right';
  return 'left';
});

</script>

<template>
  <div>
    <ul class="v-details-description">
      <li
        v-for="item in mappedItems"
        :key="item.id"
        class="v-details-description__item"
      >
        <p class="t-text-base t-text-secondaryText t-mb-1">
          {{ item.title }}
        </p>
        <div class="t-flex t-gap-2 t-items-center">
          <p :class="[item.classNames ?? 't-text-text t-text-base t-font-bold']">
            {{ item.description }}
          </p>
          <i
            v-if="item?.tooltip?.text && tooltipDirection === 'right'"
            v-tooltip.right="item.tooltip.text"
            class="icon-item-circle-info t-text-secondaryText t-ml-1"
          />
          <i
            v-if="item?.tooltip?.text && tooltipDirection === 'left'"
            v-tooltip.left="item.tooltip.text"
            class="icon-item-circle-info t-text-secondaryText t-ml-1"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.v-details-description {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
