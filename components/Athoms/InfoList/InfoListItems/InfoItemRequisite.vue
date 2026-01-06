<script setup lang="ts">

defineProps({
  dataItem: {
    type: Object as PropType<{ [key: string]: any }>,
    default: () => {},
  },
  index: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div
    class="v-requisites-description"
    :class="{
      't-rounded-e-lg t-rounded-bl-lg': index === 0,
      't-rounded-lg': index !== 0,
    }"
  >
    <div class="t-flex t-justify-between t-px-4 t-pt-4 t-pb-2">
      <h3 v-if="dataItem?.title" class="t-font-semibold t-text-xl t-leading-[38px]">
        {{ dataItem.title }}
      </h3>

      <VBtn
        v-if="dataItem?.copiedContent?.text"
        view-mode="secondary"
        data-test="copy-btn"
        @click="useOnCopyValue(dataItem.copiedContent.text)"
      >
        {{ dataItem.copiedContent?.btnText }}
      </VBtn>
    </div>
    <ul v-if="dataItem?.data" class="v-requisites-description__list">
      <li
        v-for="item in dataItem.data"
        :key="item.id"
        class="t-text-base t-p-4"
      >
        <div class="t-flex t-gap-1 t-mb-1 t-items-center">
          <p class="t-text-base t-inline-block t-text-secondaryText">
            {{ item.title }}
          </p>
          <button
            v-if="item.copiedContent"
            @click="useOnCopyValue(item.copiedContent)"
          >
            <i class="icon-action-copy t-text-secondaryText t-text-sm" />
          </button>
        </div>
        <div class="t-flex t-gap-2 t-items-center">
          <p class="t-text-text t-text-base t-font-semibold" @click="item.description !== 'No data' ? useOnCopyValue(item.description) : (() => {})">
            {{ item.description }}
          </p>
          <i
            v-if="item?.tooltip?.text"
            v-tooltip.right="item.tooltip.text"
            class="icon-item-circle-info t-text-secondaryText t-ml-1"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.v-requisites-description {
  background-color: #fff;
  padding: 8px;

  &__list {
    display: grid;
    grid-template-columns: auto;

    @screen lg {
      grid-template-columns: auto auto;
    }

    @screen 2xl {
      grid-template-columns: auto auto auto;
    }
  }
}
</style>
