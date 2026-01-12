<script setup lang="ts">
const date = ref(new Date().toISOString().slice(0, 10))
const { data, refresh } = await useFetch(() => `/api/meals/day?date=${date.value}`)

watch(date, async () => {
  await refresh()
})

const addModalOpen = ref(false)
const addMealType = ref<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'>('BREAKFAST')

function openAdd(type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK') {
  addMealType.value = type
  addModalOpen.value = true
}

async function handleCreated() {
  await refresh()
}

async function openMeal(id: string) {
  await navigateTo(`/meals/${id}`)
}

async function deleteMeal(id: string) {
  await $fetch('/api/meals/delete', { method: 'DELETE', query: { mealId: id } })
  await refresh()
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
const kcalGoal = computed(() => (goalData.value?.goal as any)?.dailyKcalTarget ?? goalData.value?.goal?.kcalTarget ?? null)
const proteinGoal = computed(() => goalData.value?.goal?.proteinTarget ?? null)
</script>

<template>
  <div class="v-meals-page t-min-h-screen">
    <header class="t-mb-6">
      <h1 class="t-text-2xl t-font-semibold">
        Meals
      </h1>
      <p class="t-text-sm t-opacity-70 t-mt-1 t-max-w-2xl">
        Log what you eat throughout the day. The more detailed you are, the more accurate your stats and progress.
      </p>
    </header>

    <div class="v-meals-wrapper">
      <!-- Date navigation & Add buttons -->
      <a-card class="v-card" :bordered="false">
        <h2 class="t-text-xl t-font-semibold t-mb-3">Select Date</h2>
        <div class="t-flex t-items-center t-gap-2 t-mb-4">
          <VBtn variant="secondary" @click="shiftDay(-1)">◀</VBtn>
          <input v-model="date" type="date" class="v-input" />
          <VBtn variant="secondary" @click="shiftDay(1)">▶</VBtn>
        </div>
        <p class="t-text-xs t-opacity-70 t-mb-4">
          Add a meal to track your nutrition for this day.
        </p>
        <div class="t-flex t-flex-col t-gap-2">
          <VBtn class="t-w-full" @click="openAdd('BREAKFAST')">+ Breakfast</VBtn>
          <VBtn class="t-w-full" @click="openAdd('LUNCH')">+ Lunch</VBtn>
          <VBtn class="t-w-full" @click="openAdd('DINNER')">+ Dinner</VBtn>
          <VBtn class="t-w-full" @click="openAdd('SNACK')">+ Snack</VBtn>
        </div>
      </a-card>

      <!-- Today's totals & Goal comparison -->
      <a-card class="v-card v-card--wide" :bordered="false">
        <h2 class="t-text-xl t-font-semibold t-mb-3">Daily Summary</h2>
        <div class="t-grid t-grid-cols-1 md:t-grid-cols-2 t-gap-6">
          <section class="v-block">
            <div class="t-text-xs t-opacity-70 t-mb-1">Today's totals</div>
            <div class="t-text-2xl t-font-semibold">
              {{ Math.round(dayTotals.kcal) }} kcal
            </div>
            <div class="t-text-xs t-opacity-80 t-mt-1">
              Protein: {{ Math.round(dayTotals.p) }} g · Carbs: {{ Math.round(dayTotals.c) }} g · Fat: {{ Math.round(dayTotals.f) }} g
            </div>
            <div class="t-text-[11px] t-opacity-70 t-mt-2">
              Logged meals: {{ dayTotals.count }}
            </div>
          </section>

          <section class="v-block">
            <div class="t-text-xs t-opacity-70 t-mb-1">Against your goal</div>
            <template v-if="kcalGoal || proteinGoal">
              <p v-if="kcalGoal" class="t-text-sm">
                Calories: {{ Math.round(dayTotals.kcal) }} / {{ Math.round(kcalGoal) }} kcal
              </p>
              <p v-if="proteinGoal" class="t-text-sm">
                Protein: {{ Math.round(dayTotals.p) }} / {{ Math.round(proteinGoal) }} g
              </p>
            </template>
            <p v-else class="t-text-sm t-opacity-70">
              Set your goal on the Goals page to see how your day matches your plan.
            </p>
            <p class="t-text-xs t-opacity-70 t-mt-2">
              Try to keep your day within ±10% of your calorie and protein targets.
            </p>
          </section>
        </div>
      </a-card>

      <!-- Tips -->
      <a-card class="v-card v-card--full" :bordered="false">
        <h2 class="t-text-xl t-font-semibold t-mb-2">Tips for better tracking</h2>
        <ul class="t-list-disc t-pl-4 t-space-y-1 t-text-sm">
          <li>Log meals right after eating — it takes <b>less than a minute</b> and keeps your data fresh.</li>
          <li>Use snacks to close your protein or fruit/veggie gap.</li>
          <li>Be honest with portions. Your goal is awareness, not "perfect" numbers.</li>
        </ul>
      </a-card>

      <!-- Meals list -->
      <a-card class="v-card v-card--full" :bordered="false">
        <h2 class="t-text-xl t-font-semibold t-mb-3">Meals</h2>
        <MealsList
          :meals="data?.meals || []"
          @open="openMeal"
          @delete="deleteMeal"
        />
      </a-card>
    </div>

    <MealsAddDialog
      v-model="addModalOpen"
      :date="date"
      :meal-type="addMealType"
      @created="handleCreated"
    />
  </div>
</template>

<style scoped lang="scss">
.v-meals-page {
  background-color: #f9fafb;
  color: #111827;
}

.v-meals-wrapper {
  align-items: start;
  display: grid;
  gap: theme('spacing.6');
  grid-auto-rows: min-content;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);

  @screen xlMax {
    grid-template-columns: minmax(0, 1fr);
  }
}

.v-card {
  background-color: #fff;
  border-radius: theme('borderRadius.2xl');
  box-shadow: 0 4px 10px #0000001a;
  box-sizing: border-box;
  color: #111827;
  padding: theme('spacing.6');
  width: 100%;
}

.v-card--wide {
  max-width: none;
}

.v-card--full {
  grid-column: 1 / -1;
}

.v-block {
  background-color: #f9fafb;

  @apply t-rounded-2xl t-p-4;
}

.v-input {
  @apply t-bg-transparent t-border t-rounded-xl t-px-3 t-py-2 t-outline-none;
  background-color: #fff;
  border-color: #e5e7eb;
  color: #111827;

  &:focus {
    border-color: #2563eb;
  }
}

h1,
h2,
h3 {
  color: #2563eb;
}

p {
  color: #4b5563;
}
</style>
