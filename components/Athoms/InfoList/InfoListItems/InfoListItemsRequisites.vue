<script setup lang="ts">

defineProps({
  dataItems: {
    type: Array as PropType<{ [key: string]: any }[]> | undefined,
    default: () => [],
  },
});

</script>

<template>
  <div>
    <ul v-if="dataItems" class="t-flex t-flex-col t-gap-6">
      <li
        v-for="(dataItem, idx) in dataItems"
        :key="dataItem?.id"
        :index="idx"
      >
        <InfoItemRequisite v-if="dataItem.data.length" :index="idx" :data-item="dataItem" />
      </li>
    </ul>
    <div v-else>
      <i class="icon-item-file" />
    </div>
  </div>
</template>
