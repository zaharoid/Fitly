<script lang="ts" setup>
// import type { NavItem } from '~t/SignTypes';
// import { LINK_SIGNIN, LINK_DASHBOARD } from '~/entries/pageLinks';

const NAV_ITEMS = ref<NavItem[]>([
  {
    id: 'privacy',
    title: 'Privacy Policy',
    link: 'https://montowire.ca/privacy-policy/',
    target: '_blank',
  }, {
    id: 'terms',
    title: 'Terms & Conditions',
    link: 'https://montowire.ca/terms-of-use/',
    target: '_blank',
  }, {
    id: 'amlPolicy',
    title: 'AML Policy',
    link: 'https://montowire.ca/aml-policy/',
    target: '_blank',
  },
]);

const route = useRoute();
// const { getLinkThisCompany } = useProjectLink();

// const logoLinkTo = computed(() => {
//   const pageAccesses = utilGetPageAccesses(route.meta?.authAccess as string);
//   const companyId = String(route.params?.companyId || '');
//   if (pageAccesses.unauth || !companyId) return LINK_SIGNIN();
//   return getLinkThisCompany(LINK_DASHBOARD());
// });
</script>
<template>
  <ClientOnly>
    <div class="v-layout-login">
      <div class="v-layout-login__content-side v-layout-login__content-side--main">
        <!-- <LogoLink
          class="t-self-center t-mb-6 v-layout-login__logo"
          :to="logoLinkTo"
        /> -->
        <div class="t-grow">
          <slot />
        </div>
        <SignNav
          :nav-items="NAV_ITEMS"
          screen-mode="mobile"
          class="lg:t-hidden t-mt-6"
        />
      </div>
      <div class="v-layout-login__content-side v-layout-login__content-side--minor">
        <SignSidePart
          :nav-items="NAV_ITEMS"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss">
.v-layout-login {
  @apply t-flex t-min-h-screen;
  position: relative;

  @screen lg {

    &__logo {
      display: none;
    }
  }

  &__content-side {
    @apply t-flex t-flex-col;
    flex-grow: 1;
    padding: theme('spacing.6');

    &--main {
    //   background-color: theme('colors.cards');
      flex: 3 1 200px;
    }

    &--minor {
      @apply t-hidden lg:t-flex;
      background-color: theme('colors.background');
      flex: 4 1 200px;
      padding-bottom: 0;
    }
  }
}
</style>
