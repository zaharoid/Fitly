<script setup lang="ts">

// const resizeStore = useResizeStore();
// const {
//   showContent,
//   showInsteadOfContent,
//   verificationData,
// } = useVerificationData();
// const { getLinkThisCompany } = useProjectLink();

// const route = useRoute();

// const COMPANY_PREFIX = 'company-';
// const BLOCKABLE_PAGES = [
//   '',
//   'outgoing-transfers',
//   'currency-exchange',
//   'history-transactions',
//   'tariffs',
//   'parties',
// ];

// function isPageBlockableContent (fullPath: string) {
//   const reg = new RegExp(`^\\/${COMPANY_PREFIX}[^/]+\\/?`, 'ig');
//   const easyPath = (fullPath || '').replace(reg, '');
//   return BLOCKABLE_PAGES.some((page) => {
//     const reg = new RegExp(`^${page}((\\/|\\?).*)?$`, 'ig');
//     return Boolean(easyPath.match(reg));
//   });
// }

// const isPageChat = computed(() => {
//   return route?.fullPath?.includes('/get-help/topic');
// });
</script>
<template>
  <ClientOnly>
    <div class="v-layout-default">
      <DefaultHeader />
      <main class="v-layout-default__main">
        <!-- <Transition name="u-opac">
          <DefaultSidebar
            v-if="resizeStore.mq.from_md"
            class="v-layout-default__sidebar t-z-navbar"
            :main-links="mainLinks"
            :footer-links="footerLinks"
          />
        </Transition>
        <div
          v-show="localShowContent"
          :class="{
            'v-layout-default__content-chat': isPageChat,
            'v-layout-default__content': !isPageChat,
          }"
        >
          <BreadcrumbsGlobal class="t-mb-4" />
          <slot />
        </div>
        <div
          v-if="!localShowContent"
          :class="{
            'v-layout-default__content-chat': isPageChat,
            'v-layout-default__content': !isPageChat,
          }"
        >
          <EmptyBlock
            v-if="showInsteadOfContent.preScreened"
            title="Thank you for your registration!"
            :description="preScreenedDescription"
            :img="{ url: '/img/overlap/overlap-call-center.png', alt: 'Pre-screened' }"
          />
          <VerificationTable
            v-if="showInsteadOfContent.verificationTable"
            :content-data="verificationData"
          />
          <EmptyBlock
            v-if="showInsteadOfContent.rejectMessage"
            title="Verification failed"
            description="We cannot provide you with access
              to the application because your account
              has not been verified. Please contact support."
            :img="{
              url: '/img/overlap/overlap-verification-failed.png',
              alt: 'Forbid',
            }"
            :btns="[{
              id: 'btn-support',
              title: 'Contact support',
              viewMode: 'primary',
              action: getLinkThisCompany('/get-help'),
            }]"
          />
          <EmptyBlock
            v-if="showInsteadOfContent.pendingMessage"
            title="Thank you for submitting the verification!"
            description="Your application will be reviewed by our
              team. This usually takes about 1 business day.
              You will receive a notification by email."
            :img="{
              url: '/img/overlap/overlap-form.png',
              alt: 'Under verification',
            }"
            :btns="[{
              id: 'btn-support',
              title: 'Contact support',
              viewMode: 'secondary',
              action: getLinkThisCompany('/get-help'),
            }]"
          />
        </div> -->
      </main>
    </div>
  </ClientOnly>
</template>

<style lang="scss">
.v-layout-default {
  min-height: 100%;
  padding-top: 52px;

  @screen md {
    padding-top: 70px;
  }

  &__main {
    transition: padding ease .3s;

    @screen md {
      padding-left: 296px;
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
    top: 86px;
    transform: translateX(-296px);
    transition: transform .3s ease;
    width: 280px;

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
