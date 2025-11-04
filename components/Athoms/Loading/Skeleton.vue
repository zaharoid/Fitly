<script setup lang="ts">

type SlotType = 'text' | 'image' | 'avatar' | 'block' | 'default';

// This code will be updated after using new cases
function getSlotType (nodes: any): SlotType[] {
  return nodes.map((node: any) => {
    if (typeof node?.type === 'object') {
      if (node?.type?.__name === 'ImageProfile') {
        return 'avatar';
      } else {
        return 'default';
      }
    }

    const textTags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (textTags.includes(node.type)) {
      return 'text';
    }

    const imageTags = ['img', 'svg'];
    if (imageTags.includes(node.type)) {
      return 'image';
    }

    const blockTags = ['div'];
    if (blockTags.includes(node.type)) {
      return 'block';
    }

    return 'default';
  });
}

const slots = useSlots();

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
  },
  lines: {
    type: Number,
    default: 1,
    required: false,
  },
});

const tagArray = computed(() => {
  if (slots.default) {
    return getSlotType(slots.default());
  }
  return [];
});

</script>

<template>
  <template v-if="props.loading">
    <slot />
  </template>

  <template v-else>
    <div role="status" class="t-w-full t-animate-pulse t-gap-3 t-flex t-flex-col">
      <div v-for="(slot, index) in tagArray" :key="index" class="t-w-full">
        <template v-if="slot === 'text'">
          <span class="t-h-3 t-bg-background t-rounded-full t-w-full t-min-w-full t-block" />
        </template>

        <template v-if="slot === 'block'">
          <span v-for="line in lines" :key="line" class="t-h-3 t-bg-background t-rounded-full t-w-full t-min-w-full t-block t-mb-2" />
        </template>

        <template v-if="slot === 'avatar'">
          <span class="t-w-12 t-h-12 t-block t-bg-background t-rounded-full" />
        </template>
      </div>
    </div>
  </template>
</template>
