<script setup lang="ts">
import { useSidebarData } from '~/compasables/useSidebarData';

const resizeStore = useResizeStore();
const { mainLinks, actions } = useSidebarData();

</script>
<template>
  <div class="v-layout-default">
      <DefaultHeader />
      <main class="v-layout-default__main">
          <DefaultSidebar
            class="v-layout-default__sidebar t-z-navbar"
            :main-links="mainLinks"
            :actions="actions"
          />
        <div class="v-layout-default__content">
          <slot />
        </div>
      </main>
    </div>
</template>

<style lang="scss" scoped>
.v-layout-default {
  min-height: 100%;
  padding-top: 52px;

  @screen md {
    padding-top: 70px;
  }

  &__main {
    transition: padding ease .3s;

    @screen md {
      padding-left: 216px;
    }
  }

  &__content {
    padding: theme('spacing.4');

    @screen md {
      padding: theme('spacing.6');
    }

    @screen 2xl {
      padding: theme('spacing.8');
    }
  }

  &__content-chat {
    padding: theme('spacing.4');

    @screen md {
      padding: theme('spacing.4') theme('spacing.6');
    }

    @screen 2xl {
      padding: theme('spacing.4') theme('spacing.8');
    }
  }

  &__sidebar {
    @include scrollbar;
    bottom: theme('spacing.4');
    height: auto;
    left: 0;
    left: theme('spacing.4');
    overflow: auto;
    position: fixed;
    top: 94px;
    transform: translateX(-296px);
    transition: transform .3s ease;
    width: 200px;

    @screen md {
      transform: translateX(0);
    }
  }

  // remove or refactor those styles

  &__profile-select {
    padding: theme('spacing.2');
    right: theme('spacing.4');
    width: 100%;
  }
}
</style>
