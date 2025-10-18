<script setup lang="ts">
import NavigateLink from '../Molucules/NavigateLink/NavigateLink.vue';


// import type { NavLink } from '~/types'; // Adjust the import path to the correct location of NavLink type

const props = defineProps({
  mainLinks: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  actions: {
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
    v-if="props.mainLinks?.length || props.actions?.length"
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
          :disabled="link.disabled"
          @click="$emit('clickItem', link)"
        />
      </li>
    </ul>
    <ul
      v-if="props.actions?.length"
      class="v-default-sidebar__list"
    >
      <li
        v-for="actionItem in props.actions"
        :key="actionItem.id"
      >
        <NavigateLink
          :id="actionItem.id"
          :title="actionItem.title"
          :count="actionItem.count"
          :data-test="`${actionItem.title?.toLowerCase().split(' ').join('-')}-sidebar-item`"
          :icon="actionItem.icon"
          :disabled="actionItem.disabled"
          :exact="actionItem.exact"
          :action="actionItem.action"
        />
      </li>
    </ul>
  </aside>
</template>

<style lang="scss">
.v-default-sidebar {
  background: theme('colors.cards');
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  padding: 20px 12px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
