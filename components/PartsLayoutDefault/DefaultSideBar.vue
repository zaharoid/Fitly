<script setup lang="ts">

// import type { NavLink } from '~/types'; // Adjust the import path to the correct location of NavLink type

const props = defineProps({
  mainLinks: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  footerLinks: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
defineEmits(['clickItem']);
// const companiesStore = useCompaniesStore();

function isNewTransferLink (link: any) {
  return String(link.id).includes('new-transfer');
}

</script>

<template>
  <aside
    v-if="props.mainLinks?.length || props.footerLinks?.length"
    class="v-default-sidebar"
  >
    <ul
      v-if="props.mainLinks?.length"
      class="v-default-sidebar__list"
    >
      <li
        v-for="link in props.mainLinks"
        :key="link.id"
      >
        <NavigateLink
          :id="link.id"
          :title="link.title"
          :path="link.path"
          :data-test="`${link.title?.toLowerCase().split(' ').join('-')}-sidebar-item`"
          :count="link.count"
          :icon="link.icon"
          :exact="link.exact"
          :disabled="link.disabled || (isNewTransferLink(link) && companiesStore.isStatusClosed)"
          @click="$emit('clickItem', link)"
        />
      </li>
    </ul>
    <ul
      v-if="props.footerLinks?.length"
      class="v-default-sidebar__list"
    >
      <li
        v-for="link in props.footerLinks"
        :key="link.id"
      >
        <NavigateLink
          :id="link.id"
          :title="link.title"
          :path="link.path"
          :count="link.count"
          :data-test="`${link.title?.toLowerCase().split(' ').join('-')}-sidebar-item`"
          :icon="link.icon"
          :disabled="link.disabled"
          :exact="link.exact"
          @click="$emit('clickItem', link)"
        />
      </li>
    </ul>
  </aside>
</template>

<style lang="scss">
.v-default-sidebar {
//   background: theme('colors.cards');
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 16px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
