<script setup lang="ts">
const route = useRoute()
const mealId = route.params.mealId as string

const { data, refresh } = await useFetch('/api/meals/one', { query: { mealId } })
const meal = computed(() => data.value?.meal || null)

async function onSaved() {
  await refresh({ query: { mealId } })
}
async function changeType(newType: string) {
  if (!meal.value) return
  await $fetch('/api/meals/update', {
    method: 'PUT',
    body: { mealId: meal.value.id, items: meal.value.itemsJson, mealType: newType },
  })
  await refresh({ query: { mealId } })
}
</script>

<template>
  <div class="t-p-6 t-min-h-screen t-bg-[var(--bg,#0f1114)] t-text-[var(--text,#eef0f3)]">
    <div class="t-max-w-4xl t-mx-auto t-space-y-4">
      <div class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-p-5 t-flex t-justify-between t-items-center">
        <h1 class="t-text-lg t-font-semibold">Приём пищи</h1>
        <NuxtLink to="/app/meals" class="t-btn">Назад</NuxtLink>
      </div>

      <div v-if="meal">
        <MealEditor :meal="meal" @save="onSaved" @change-type="changeType" />
      </div>
      <div v-else class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-p-5">
        Не найдено
      </div>
    </div>
  </div>
</template>

<style scoped>
.t-btn { @apply t-text-xs t-rounded-xl t-px-3 t-py-1 t-bg-white/10 hover:t-opacity-80; }
</style>
