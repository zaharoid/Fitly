<script setup lang="ts">
const date = ref(new Date().toISOString().slice(0, 10))
const { data, refresh } = await useFetch('/api/meals/day', { query: { date: date.value } })

watch(date, async (d) => {
  await refresh({ query: { date: d } })
})

const addModalOpen = ref(false)
const addMealType = ref<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'>('BREAKFAST')

function openAdd(type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK') {
  addMealType.value = type
  addModalOpen.value = true
}

async function handleCreated() {
  await refresh({ query: { date: date.value } })
}

async function openMeal(id: string) {
  await navigateTo(`/app/meals/${id}`)
}

async function deleteMeal(id: string) {
  await $fetch('/api/meals/delete', { method: 'DELETE', query: { mealId: id } })
  await refresh({ query: { date: date.value } })
}

function shiftDay(delta: number) {
  const d = new Date(date.value + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + delta)
  date.value = d.toISOString().slice(0, 10)
}

const dayTotals = computed(() => {
  const meals = data.value?.meals || []
  return meals.reduce(
    (a: any, x: any) => {
      a.kcal += x.kcal || 0
      a.p += x.protein || 0
      a.c += x.carbs || 0
      a.f += x.fat || 0
      a.count += 1
      return a
    },
    { kcal: 0, p: 0, c: 0, f: 0, count: 0 },
  )
})

const { data: goalData } = await useFetch('/api/goals/get')
const kcalGoal = computed(() => goalData.value?.goal?.dailyKcalTarget ?? goalData.value?.goal?.kcalTarget ?? null)
const proteinGoal = computed(() => goalData.value?.goal?.proteinTarget ?? null)
</script>

<template>
  <div class="t-min-h-screen t-bg-[var(--bg,#0f1114)">
    <div class="t-max-w-5xl t-mx-auto t-space-y-5">
      <a-card
        class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-border-0 t-shadow-none t-flex t-flex-col t-gap-4 md:t-flex-row md:t-items-center md:t-justify-between"
        :bordered="false"
      >
        <div>
          <h1 class="t-text-xl t-font-semibold">Meals</h1>
          <p class="t-text-xs t-opacity-70 t-mt-1">
            Log what you eat throughout the day. The more detailed you are, the more accurate your stats and progress.
          </p>
          <div class="t-flex t-items-center t-gap-2 t-mt-3 t-mb-3">
            <button class="v-btn" @click="shiftDay(-1)">◀</button>
            <input v-model="date" type="date" class="v-input" />
            <button class="v-btn" @click="shiftDay(1)">▶</button>
          </div>
        </div>
        <div class="t-flex t-flex-wrap t-gap-2 t-mt-1 md:t-mt-0">
          <button class="v-btn" @click="openAdd('BREAKFAST')">+ Breakfast</button>
          <button class="v-btn" @click="openAdd('LUNCH')">+ Lunch</button>
          <button class="v-btn" @click="openAdd('DINNER')">+ Dinner</button>
          <button class="v-btn" @click="openAdd('SNACK')">+ Snack</button>
        </div>
      </a-card>
      <a-card
        class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-border-0 t-shadow-none"
        :bordered="false"
      >
        <div class="t-grid t-grid-cols-1 md:t-grid-cols-3 t-gap-4">
          <div class="t-space-y-1">
            <div class="t-text-xs t-opacity-70">Today’s totals</div>
            <div class="t-text-2xl t-font-semibold">
              {{ Math.round(dayTotals.kcal) }} kcal
            </div>
            <div class="t-text-xs t-opacity-80">
              Protein: {{ Math.round(dayTotals.p) }} g · Carbs: {{ Math.round(dayTotals.c) }} g · Fat: {{ Math.round(dayTotals.f) }} g
            </div>
            <div class="t-text-[11px] t-opacity-70 t-mt-1">
              Logged meals: {{ dayTotals.count }}
            </div>
          </div>

          <div class="t-space-y-1 t-text-xs">
            <div class="t-text-xs t-opacity-70">Against your goal</div>
            <p v-if="kcalGoal">
              Calories: {{ Math.round(dayTotals.kcal) }} / {{ Math.round(kcalGoal) }} kcal
            </p>
            <p v-if="proteinGoal">
              Protein: {{ Math.round(dayTotals.p) }} / {{ Math.round(proteinGoal) }} g
            </p>
            <p v-if="!kcalGoal && !proteinGoal" class="t-opacity-70">
              Set your goal on the Goals page to see how your day matches your plan.
            </p>
            <p class="t-opacity-70 t-mt-1">
              Try to keep your day within ±10% of your calorie and protein targets. It’s okay if some days are not perfect.
            </p>
          </div>

          <div class="t-space-y-1 t-text-xs">
            <div class="t-text-xs t-opacity-70">Tips for better tracking</div>
            <ul class="t-list-disc t-pl-4 t-space-y-1">
              <li>Log meals right after eating — it takes <b>less than a minute</b> and keeps your data fresh.</li>
              <li>Use snacks to close your protein or fruit/veggie gap.</li>
              <li>Be honest with portions. Your goal is awareness, not “perfect” numbers.</li>
            </ul>
          </div>
        </div>
      </a-card>
      <MealsList
        :meals="data?.meals || []"
        @open="openMeal"
        @delete="deleteMeal"
      />
      <MealsAddDialog
        v-model="addModalOpen"
        :date="date"
        :meal-type="addMealType"
        @created="handleCreated"
      />
    </div>
  </div>
</template>

<style scoped>
.v-card {
  background-color: #fff; /* Светлый фон для карточек */
  box-shadow: 0 6px 14px -10px #0000001a;
  color: #111827; /* Темный текст */
}

.v-btn {
  @apply t-text-xs t-rounded-xl t-px-3 t-py-1;
  background-color: #0000000d; /* Светлый фон для кнопок */
  color: #111827; /* Темный текст кнопок */

  &:hover {
    opacity: .8;
  }
}

.v-input {
  @apply t-bg-transparent t-border t-rounded-xl t-px-3 t-py-2 t-outline-none;
  background-color: #fff; /* Светлый фон для инпутов */
  border-color: #0000001a; /* Светлая граница */
  color: #111827; /* Темный текст */

  &:focus {
    border-color: #2563eb; /* Акцентный синий при фокусе */
  }
}

body {
  background-color: #f9fafb; /* Светлый фон страницы */
  color: #111827; /* Темный текст */
}
</style>
