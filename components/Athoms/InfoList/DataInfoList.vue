<script setup lang="ts">
import type { InfoItem, DataInfoItem } from '~t/InfoList';

const props = defineProps({
  items: {
    type: Array as PropType<DataInfoItem[]>,
    default: () => [],
  },
  viewMode: {
    type: String as PropType<''|'limited'>,
    default: null,
  },
});

const localItems = computed((): InfoItem[] => {
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
</script>
<template>
  <InfoList
    :items="localItems"
    :view-mode="props.viewMode"
  />
</template>
