<script setup lang="ts">
import { useAlertsStore } from '~/stores/alertsStore';

const store = useAlertsStore();

const maxCount = 5;
const outputedItems = computed(() => store.notifications.slice(-maxCount).reverse());

watch(() => outputedItems.value?.length, (count) => {
  if (count === 0) store.toggleTimerNotification(true);
});

const handleClose = (id: string) => {
  store.removeNotification(id);
};
</script>
<template>
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
  <TransitionGroup
    class="v-notification-list"
    name="u-list-right"
    tag="ul"
    @mouseenter="store.toggleTimerNotification(false)"
    @mouseleave="store.toggleTimerNotification(true)"
  >
    <!-- eslint-enable -->
    <li
      v-for="(item, index) in outputedItems"
      :key="item.id"
      class="v-notification-list__item"
    >
      <NotificationCard
        :title="item.title"
        :illustration="item.illustration"
        :actionBtn="item.actionBtn"
        :description="item.description"
        :badge="item.badge"
        :close-duration="item.closeDuration"
        :close-timer="item.closeTimer"
        :is-ghost="index === maxCount - 1"
        @collapse="handleClose(item.id)"
      />
    </li>
  </TransitionGroup>
</template>

<style lang="scss">
.v-notification-list {
  position: fixed;
  right: 8px;
  width: calc(100vw - 16px);
  z-index: theme('zIndex.alert');

  @screen md {
    right: 16px;
    width: 400px;
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
