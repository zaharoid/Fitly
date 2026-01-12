<script setup lang="ts">
const route = useRoute()
const mealId = route.params.mealId as string

const { data, refresh } = await useFetch(`/api/meals/one?mealId=${mealId}`)
const meal = computed(() => data.value?.meal || null)

async function onSaved() {
  await refresh()
}
async function changeType(newType: string) {
  if (!meal.value) return
  await $fetch('/api/meals/update', {
    method: 'PUT',
    body: { mealId: meal.value.id, items: meal.value.itemsJson, mealType: newType },
  })
  await refresh()
}
</script>

<template>
  <div class="t-p-6 t-min-h-screen t-bg-cards t-rounded-xl">
    <div class="t-max-w-4xl t-mx-auto t-space-y-4">
      <div class="v-card t-rounded-3xl t-p-5 t-flex t-justify-between t-items-center">
        <h1 class="t-text-xl t-font-semibold">Meal</h1>
        <VBtn @click="navigateTo('/meals')" class="t-btn">Back</VBtn>
      </div>
      
      <div v-if="meal">
        <MealEditor :meal="meal" @save="onSaved" @change-type="changeType" />
      </div>
      <div v-else class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-p-5">
        Not found
      </div>
    </div>
  </div>
</template>
