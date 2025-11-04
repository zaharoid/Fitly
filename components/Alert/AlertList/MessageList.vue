<script setup lang="ts">
import { useAlertsStore } from '~/stores/alertsStore';

const store = useAlertsStore();
const maxCount = 5;

const outputedItems = computed(() => store.messages.slice(-maxCount));
const isShowGhost = computed(() => store.messages?.length >= maxCount);

const handleClose = (id: string) => {
  store.removeMessage(id);
};
</script>
<template>
  <TransitionGroup
    name="u-list"
    tag="ul"
    class="v-message-list"
  >
    <li
      v-for="(item, index) in outputedItems"
      :key="item.id"
      class="v-message-list__item"
    >
      <MessageCard
        :title="item.title"
        :mode="item.mode"
        :is-ghost="isShowGhost && index === 0"
        :show-close-button="item.showCloseButton"
        @close="handleClose(item.id)"
      />
    </li>
  </TransitionGroup>
</template>

<style lang="scss">
.v-message-list {
  bottom: theme('spacing.1');
  left: 50%;
  position: fixed;
  transform: translateX(-50%);
  width: calc(100vw - 16px);
  z-index: theme('zIndex.alert');

  @screen md {
    width: 330px;
  }

  &:empty {
    transition-duration: 1s;
    transition-property: width, visibility;
    transition-timing-function: step-end;
    visibility: hidden;
    width: 0;
  }

  &__item {
    // for good animation on mobile devices
    // when item becomes absolute
    left: 0;
    margin-bottom: theme('spacing.4');
    right: 0;
  }
}
</style>
