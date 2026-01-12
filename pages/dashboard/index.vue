<script setup lang="ts">
const today = new Date().toISOString().slice(0, 10)

const [{ data: stats }, { data: activity }, { data: goalData }] = await Promise.all([
  useFetch<any>('/api/stats/today', { query: { date: today } }),
  useFetch('/api/stats/active-days'),
  useFetch('/api/goals/get', { default: () => ({ goal: null }) }),
])

const goal = computed(() => goalData.value?.goal || null)

const kcalGoal = computed(() => (goal.value as any)?.dailyKcalTarget ?? goal.value?.kcalTarget ?? null)
const proteinGoal = computed(() => goal.value?.proteinTarget ?? null)

const kcalProgressPct = computed(() => {
  if (!kcalGoal.value || !stats.value?.totals?.kcal) return 0
  return Math.min(300, Math.round((stats.value.totals.kcal / kcalGoal.value) * 100))
})

const todayTip = computed(() => {
  if (!kcalGoal.value || !stats.value?.totals?.kcal) {
    return 'Start logging your meals today — even one full day gives you a clearer picture of your nutrition.'
  }
  const left = Math.round(kcalGoal.value - stats.value.totals.kcal)
  if (left > 120) {
    return `You still have ~${left} kcal left — don’t be afraid to eat enough protein and slow carbs.`
  }
  if (left < -150) {
    return `You went about ${Math.abs(left)} kcal over your target. That’s ok — just try to get closer tomorrow.`
  }
  return 'Nice, you are close to your calorie target. Try to hit your protein goal to support your progress.'
})
</script>

<template>
  <div class="t-min-h-screen t-text-text">
    <div class="t-grid t-grid-cols-12 t-gap-5">
      <section class="t-col-span-12 lg:t-col-span-9">
        <a-card class="v-panel">
          <div class="t-flex t-justify-between t-items-center t-mb-4">
            <div>
              <h1 class="v-title">Today · {{ today }}</h1>
              <p class="t-text-xs t-opacity-70 t-mt-1">
                Track what you eat and how you move — this dashboard shows how close you are to your daily target.
              </p>
            </div>
            <VLinkBtn viewMode="ghost-secondary" to="/meals">
              Open meals
            </VLinkBtn>
          </div>

          <div class="t-grid t-grid-cols-2 md:t-grid-cols-4 t-gap-3">
            <a-card class="v-card" :bordered="false">
              <div class="t-text-xs t-opacity-70">Calories</div>
              <div class="v-stat">{{ Math.round(stats?.totals?.kcal || 0) }}</div>
              <div v-if="kcalGoal" class="t-text-[11px] t-opacity-70 t-mt-1">
                Target: {{ Math.round(kcalGoal || 0) }} kcal
              </div>
            </a-card>

            <a-card class="v-card" :bordered="false">
              <div class="t-text-xs t-opacity-70">Protein</div>
              <div class="v-stat">{{ Math.round(stats?.totals?.p || 0) }} g</div>
              <div v-if="proteinGoal" class="t-text-[11px] t-opacity-70 t-mt-1">
                Target: {{ Math.round(proteinGoal || 0) }} g
              </div>
            </a-card>

            <a-card class="v-card" :bordered="false">
              <div class="t-text-xs t-opacity-70">Carbs</div>
              <div class="v-stat">{{ Math.round(stats?.totals?.c || 0) }} g</div>
            </a-card>

            <a-card class="v-card" :bordered="false">
              <div class="t-text-xs t-opacity-70">Fat</div>
              <div class="v-stat">{{ Math.round(stats?.totals?.f || 0) }} g</div>
            </a-card>
          </div>

          <div class="t-grid t-grid-cols-2 md:t-grid-cols-4 t-gap-3 t-mt-4">
            <a-card class="v-card t-flex t-flex-col t-justify-between" :bordered="false">
              <div>
                <div class="t-text-xs t-opacity-70">Breakfast</div>
                <div class="v-stat-small">
                  {{ Math.round(stats?.byType?.BREAKFAST?.kcal || 0) }} kcal
                </div>
              </div>
              <p class="v-helper">
                Try to include protein + fiber — it helps to control appetite for the whole day.
              </p>
            </a-card>

            <a-card class="v-card t-flex t-flex-col t-justify-between" :bordered="false">
              <div>
                <div class="t-text-xs t-opacity-70">Lunch</div>
                <div class="v-stat-small">
                  {{ Math.round(stats?.byType?.LUNCH?.kcal || 0) }} kcal
                </div>
              </div>
              <p class="v-helper">
                Aim for a balanced plate: ½ veggies, ¼ protein, ¼ carbs + a bit of healthy fat.
              </p>
            </a-card>

            <a-card class="v-card t-flex t-flex-col t-justify-between" :bordered="false">
              <div>
                <div class="t-text-xs t-opacity-70">Dinner</div>
                <div class="v-stat-small">
                  {{ Math.round(stats?.byType?.DINNER?.kcal || 0) }} kcal
                </div>
              </div>
              <p class="v-helper">
                Keep dinner lighter and focus on protein — it supports recovery while you sleep.
              </p>
            </a-card>

            <a-card class="v-card t-flex t-flex-col t-justify-between" :bordered="false">
              <div>
                <div class="t-text-xs t-opacity-70">Snacks</div>
                <div class="v-stat-small">
                  {{ Math.round(stats?.byType?.SNACK?.kcal || 0) }} kcal
                </div>
              </div>
              <p class="v-helper">
                Use snacks to close your protein or fruit/veggie gap instead of random sugar.
              </p>
            </a-card>
          </div>

          <div class="t-grid t-grid-cols-1 md:t-grid-cols-2 t-gap-4 t-mt-6">
            <a-card class="v-card t-flex t-items-center t-gap-4" :bordered="false">
              <div class="v-progress-circle">
                <div class="v-progress-circle__inner">
                  <span class="t-text-sm t-font-semibold">
                    {{ kcalGoal ? kcalProgressPct : 0 }}%
                  </span>
                </div>
              </div>
              <div class="t-text-xs t-space-y-1">
                <div class="t-font-semibold t-text-sm">Calories vs goal</div>
                <p class="t-opacity-80">
                  {{ stats?.totals?.kcal || 0 }} / {{ kcalGoal || '—' }} kcal
                </p>
                <p v-if="kcalGoal" class="t-opacity-70">
                  {{ todayTip }}
                </p>
                <p v-else class="t-opacity-60">
                  Set your goal in the Goals tab to see your daily progress here.
                </p>
              </div>
            </a-card>

            <a-card class="v-card t-text-xs t-space-y-2" ::bordered="false">
              <div class="t-font-semibold t-text-sm">Today’s micro goals</div>
              <ul class="t-list-disc t-pl-4 t-space-y-1">
                <li>Log all meals — even if they are not “perfect”. Consistency beats perfection.</li>
                <li>Try to hit at least <b>{{ proteinGoal || 100 }}</b> g of protein.</li>
                <li>Drink 6–8 glasses of water and get at least 7 hours of sleep.</li>
                <li>Do a short walk after one of your main meals — it improves glucose control.</li>
              </ul>
            </a-card>
          </div>
        </a-card>
      </section>

      <aside class="t-col-span-12 lg:t-col-span-3">
        <a-card class="v-panel t-flex t-flex-col t-gap-4">
          <div>
            <div class="t-text-sm t-opacity-70">Active days</div>
            <div class="t-text-3xl t-font-semibold t-mt-1">
              {{ activity?.totalActiveDays || 0 }}
            </div>
            <div class="t-text-xs t-opacity-70 t-mt-1">
              Current streak: {{ activity?.currentStreak || 0 }} 🔥
            </div>
            <p class="t-text-[11px] t-opacity-70 t-mt-2">
              Every logged day makes your stats more accurate and keeps your motivation alive.
            </p>
          </div>

          <a-divider class="v-divider" />

          <div>
            <div class="t-text-sm t-opacity-70">Goal overview</div>
            <div v-if="goal" class="t-mt-2 t-text-xs t-space-y-1">
              <p>
                <span class="t-opacity-70">Daily target:</span>
                <span class="t-font-semibold">
                  {{ Math.round((goal as any).dailyKcalTarget ?? goal.kcalTarget ?? 0) }} kcal
                </span>
              </p>
              <p>
                Protein: {{ goal.proteinTarget || 0 }} g · Carbs: {{ goal.carbsTarget || 0 }} g · Fats: {{ goal.fatTarget || 0 }} g
              </p>
              <p v-if="goal.deadline" class="t-opacity-70">
                Deadline: {{ new Date(goal.deadline).toLocaleDateString() }}
              </p>
            </div>
            <p v-else class="t-text-xs t-opacity-70 t-mt-2">
              Set your first goal to get a personalized calorie and macro plan.
            </p>
            <VLinkBtn viewMode="ghost-secondary" to="/goals" class="t-mt-3 t-w-full">
              Edit goal
            </VLinkBtn>
          </div>

          <a-divider class="v-divider" />

          <div class="t-text-sm t-space-y-2">
            <div class="t-text-sm t-opacity-70">Small habits that compound</div>
            <ul class="t-list-disc t-pl-4 t-space-y-1">
              <li>Keep at least one high-protein food in every main meal.</li>
              <li>Plan your next meal right after logging the current one.</li>
              <li>Weigh yourself 2–3 times per week — not every hour.</li>
              <li>Use snacks to close your protein or veggie gap, not just for sugar.</li>
            </ul>
          </div>
        </a-card>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.v-panel {
  @apply t-bg-cards t-rounded-3xl t-p-5;
  box-shadow: 0 5px 10px -15px #6e8eb840;
}

.v-card {
  @apply t-bg-white/5 t-rounded-2xl t-p-4;
}

.v-title {
  @apply t-text-lg t-font-semibold;
}

.v-stat {
  @apply t-text-2xl t-font-semibold;
}

.v-stat-small {
  @apply t-text-lg t-font-semibold;
}

.v-helper {
  @apply t-text-sm t-opacity-75 t-mt-2;
}

.v-divider {
  @apply t-my-2 t-border-t t-border-white/10;
}

.v-progress-circle {
  @apply t-w-16 t-h-16 t-rounded-full t-border-4 t-border-primary/60 t-flex t-items-center t-justify-center;
}

.v-progress-circle__inner {
  @apply t-w-12 t-h-12 t-rounded-full t-bg-white/5 t-flex t-items-center t-justify-center;
}
</style>
