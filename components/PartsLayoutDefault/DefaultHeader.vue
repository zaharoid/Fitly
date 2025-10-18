<script setup lang="ts">
import type { BtnItem } from '~t/Btn';

const props = defineProps({
  isShadow: {
    type: Boolean,
    default: true,
  },
});

import { computed } from 'vue'
import { userMapper } from '~/mappers/userMapper';
const { data, status } = useAuth()

const user = computed(() => userMapper(data.value?.user)) 


const route = useRoute();
const resizeStore = useResizeStore();

const isOpenDropdown = ref(false);

</script>
<template>
  <DefaultHeaderTemplate
  >
    <!-- <HeaderNotificationBar
      class="t-mr-2 lg:t-mr-5"
    /> -->
    <div class="t-flex t-items-center t-justify-between t-w-full">
      <SvgLogo />
      <HeaderUserData 
        v-bind="user"
    />
    </div>
      <!-- <div class="v-layout-default__profile-select">

      </div> -->
    <!-- <HeaderMobileNav
      class="lg:t-hidden t-ml-2"
    /> -->
  </DefaultHeaderTemplate>
</template>
