<script setup lang="ts">

const nuxtApp = useNuxtApp();

const isOnline = useOnline();
const indicator = useLoadingIndicator({ throttle: 0 })

watch(isOnline, () => {
  if (!isOnline.value) {
    // throw createError({ statusMessage: 'No internet connection', fatal: true });
  }
}, { immediate: true });

nuxtApp.hook('page:start', () => indicator.start())
nuxtApp.hook('page:finish', () => indicator.finish())

</script>

<template>
  <NuxtLayout>
    <NotificationList />
    <MessageList />
    <!-- <PopupGlobal /> -->
    <!-- Here we can add a custom preloader component -->

    <NuxtLoadingIndicator :height="5" />
    <NuxtPage />
  </NuxtLayout>
</template>
