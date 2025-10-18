<script setup lang="ts">

const nuxtApp = useNuxtApp();
const loading = ref(true);

const isOnline = useOnline();
const { initialize } = useHotjar();
const runtimeConfig = useRuntimeConfig();

const { status } = useAuth();

watch(isOnline, () => {
  if (!isOnline.value) {
    throw createError({ statusMessage: 'No internet connection', fatal: true });
  }
}, { immediate: true });

nuxtApp.hook('page:start', () => {
  loading.value = true;
});

nuxtApp.hook('page:finish', () => {
  loading.value = false;
});
</script>

<template>
  <NuxtLayout>
    <!-- <NotificationList /> -->
    <!-- <MessageList /> -->
    <!-- <PopupGlobal /> -->
    <!-- Here we can add a custom preloader component -->

    <NuxtLoadingIndicator :height="5" />
    <NuxtPage />
  </NuxtLayout>
</template>
