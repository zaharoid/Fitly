<script setup lang="ts">
import type { Notification } from '~t/AlertNotifications';

const props = defineProps({
  idElsPrefix: {
    type: String,
    default: '',
  },
  illustration: {
    type: Object as PropType<Notification['illustration']>,
    default: undefined,
  },
  title: {
    type: String,
    default: 'title',
  },
  description: {
    type: String,
    default: '',
  },
  actionBtn: {
    type: Object as PropType<Notification['actionBtn']>,
    default: undefined,
  },
  badge: {
    type: Object as PropType<Notification['badge']>,
    default: null,
  },
  closeDuration: {
    type: Number as PropType<number|null>,
    default: null,
  },
  closeTimer: {
    type: Number as PropType<number|null>,
    default: null,
  },
  isGhost: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['collapse']);
</script>

<template>
  <div
    class="v-notification-card"
    :class="{ 'v-notification-card--ghost': isGhost }"
  >
    <NotificationContent
      :title="props.title"
      :badge="props.badge"
    >
      <template
        v-if="props.illustration"
        #image
      >
        <ImageProfileFree
          :image="props.illustration.image"
          :fallback="props.illustration.fallback"
          :title="props.illustration.title"
          class="t-w-7 t-min-w-7 t-text-sm"
        />
      </template>
      <template
        v-if="props.description"
        #default
      >
        <p
          v-htmlsafe="utilCutString(props.description, 300)"
          :data-test-id="`${idElsPrefix}-main-message`"
          class="t-text-text t-text-base"
        />
        <VLinkBtn
          v-if="props.actionBtn?.action"
          class="t-mt-2 t-px-0"
          view-mode="ghost-primary"
          :icon="{ name: 'arrow-line-right', position: 'right' }"
          :to="props.actionBtn.action"
        >
          {{ props.actionBtn.title || 'Go' }}
        </VLinkBtn>
      </template>
      <template #control>
        <div class="t-flex t-items-center">
          <button
            class="o-iconed-btn icon-action-cross card__cross t--mb-1 t-ml-1"
            @click="$emit('collapse')"
          />
        </div>
      </template>
    </NotificationContent>
    <AlertProgress
      v-if="props.closeDuration"
      :total="props.closeDuration"
      :val="Number(props.closeTimer)"
      :transition-duration="100"
      class="v-notification-card__progress"
    />
  </div>
</template>

<style lang="scss">
.v-notification-card {
  background-color: theme('colors.secondaryBackground');
  border-radius: theme('spacing.2');
  overflow: hidden;
  padding: theme('spacing.4');
  position: relative;

  &__close-btn {
    height: 32px;
    margin-right: theme('spacing.-1');
    margin-top: theme('spacing.-1');
    min-width: 32px;
    width: 32px;
    z-index: theme('zIndex.base');
  }

  &:after {
    background-image: linear-gradient(0deg, theme('colors.background') 0%, #{theme('colors.background')}00 100%);
    border-radius: theme('spacing.2');
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform .2s ease;
  }

  &--ghost:after {
    transform: scaleY(1);
  }

  &__progress {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
  }
}
</style>
