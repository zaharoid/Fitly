<script setup lang="ts">
import * as Yup from 'yup';
import { getProfileInfo } from '~/mappers/profileMapper';
import { mapGoalInfo, mapOriginGoal } from '~/mappers/mapGoal';
import type { DtoSingleGoal } from '~/types/responces/goal';

const profile = ref<any>(null)
const goal = ref<any>(null)
const savingProfile = ref(false)
const savingGoal = ref(false)
const goalMeta = ref<any>(null)
const isProfileEditing = ref(false)
const isGoalEditing = ref(false)

const profileReady = computed(() =>
  !!profile.value?.sex &&
  !!profile.value?.age &&
  !!profile.value?.heightCm &&
  !!profile.value?.weightKg
)

onMounted(async () => {
  try {
    const p = await $fetch('/api/profile/get')
    profile.value = p.profile
  } catch {}
  try {
    const g = await $fetch<{ goal: DtoSingleGoal }>('/api/goals/get')
    goal.value = mapOriginGoal(g.goal)
  } catch {}
})

const validationData = {
  sex: Yup.string().required().label('Gender'),
  age: Yup.string().required().label('Age'),
  heightCm: Yup.string().required().label('Height'),
  weightKg: Yup.string().required().label('Weight'),
}

// BMI-based weight validation
const minHealthyWeight = computed(() => {
  if (!profile.value?.heightCm) return 40
  const heightM = profile.value.heightCm / 100
  return Math.round(16 * heightM * heightM) // BMI ~16 (severely underweight threshold)
})

const maxHealthyWeight = computed(() => {
  if (!profile.value?.heightCm) return 200
  const heightM = profile.value.heightCm / 100
  return Math.round(40 * heightM * heightM) // BMI ~40 (class III obesity threshold)
})

const healthyWeightRange = computed(() => {
  if (!profile.value?.heightCm) return { min: 0, max: 0 }
  const heightM = profile.value.heightCm / 100
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(25 * heightM * heightM),
  }
})

const validationGoal = computed(() => ({
  weightTarget: Yup.number()
    .required()
    .min(minHealthyWeight.value, `Weight cannot be below ${minHealthyWeight.value} kg for your height`)
    .max(maxHealthyWeight.value, `Weight cannot exceed ${maxHealthyWeight.value} kg for your height`)
    .label('Desired weight'),
  activityLevel: Yup.string().required().label('Activity'),
  deadline: Yup.date().required().label('Deadline'),
}))

// Weight warnings (not blocking, just informational)
const weightWarning = ref<string | null>(null)
const goalFormValues = ref<any>({})

function checkWeightWarnings(weightTarget: number) {
  weightWarning.value = null
  
  if (!profile.value?.weightKg || !profile.value?.heightCm || !profile.value?.age) return
  
  const currentWeight = profile.value.weightKg
  const heightM = profile.value.heightCm / 100
  const age = profile.value.age
  const targetBmi = weightTarget / (heightM * heightM)
  const weightDiff = Math.abs(currentWeight - weightTarget)
  const weightChangePercent = (weightDiff / currentWeight) * 100
  
  const warnings: string[] = []
  
  // BMI warnings
  if (targetBmi < 18.5) {
    warnings.push(`Target BMI (${targetBmi.toFixed(1)}) is underweight. Healthy range: 18.5–25.`)
  } else if (targetBmi > 30) {
    warnings.push(`Target BMI (${targetBmi.toFixed(1)}) is in obese range. Consider a lower target.`)
  } else if (targetBmi > 25) {
    warnings.push(`Target BMI (${targetBmi.toFixed(1)}) is overweight. Healthy range: 18.5–25.`)
  }
  
  // Aggressive weight loss warning
  if (weightChangePercent > 20) {
    warnings.push(`Changing weight by ${weightChangePercent.toFixed(0)}% is aggressive. Consider smaller steps.`)
  }
  
  // Age-specific warnings
  if (age > 65 && targetBmi < 22) {
    warnings.push(`For age 65+, BMI below 22 may increase health risks.`)
  }
  
  if (age < 18 && (targetBmi < 18 || targetBmi > 27)) {
    warnings.push(`For teens, consult a doctor before setting weight goals.`)
  }
  
  weightWarning.value = warnings.length > 0 ? warnings.join(' ') : null
}

async function onSubmitProfile(values: any) {
  savingProfile.value = true
  try {
    const res = await $fetch('/api/profile/set', { method: 'POST', body: values })
    profile.value = res.profile
  } finally {
    savingProfile.value = false
    isProfileEditing.value = false
  }
}

async function onSubmitGoal(values: any) {
  savingGoal.value = true
  const body = {
    ...values,
    deadline: values.deadline.toISOString().split('T')[0],
  }
  try {
    const res = await $fetch('/api/goals/set-smart', { method: 'POST', body })
    goal.value = mapOriginGoal(res.goal)
    goalMeta.value = res.meta
  } finally {
    savingGoal.value = false
    isGoalEditing.value = false
  }
}
</script>

<template>
  <div class="v-goal-page t-min-h-screen">
    <header class="t-mb-6">
      <h1 class="t-text-2xl t-font-semibold t-text-text">
        Goals
      </h1>
      <p class="t-text-sm t-opacity-70 t-mt-1 t-max-w-2xl">
        Fitly uses your personal data and your target to calculate a realistic daily plan.
        Update your information when your lifestyle or goal changes — we’ll adjust the plan automatically.
      </p>
    </header>

    <div class="v-goal-wrapper">
      <!-- PROFILE -->
      <a-card class="v-card" :bordered="false">
        <div v-if="!profileReady || isProfileEditing">
          <h2 class="t-text-xl t-font-semibold t-mb-2">Tell about yourself</h2>
          <p class="t-text-sm t-opacity-70 t-mb-4">
            Start with the basics: gender, age, height and current weight. This is needed to estimate your energy needs.
          </p>
          <VForm
            :validation-schema="validationData"
            id="personal-data"
            class="t-flex t-flex-col t-gap-4"
            @submit="onSubmitProfile"
          >
            <EditPersonalDataForm :origin-data="profile" />
            <VBtn
              class="t-mt-2 t-w-full"
              type="submit"
              form="personal-data"
              :disabled="savingProfile"
            >
              Save data
            </VBtn>
          </VForm>
        </div>

        <div v-else class="t-flex t-flex-col t-h-full">
          <h2 class="t-text-xl t-font-semibold t-mb-3">Your Data</h2>
          <InfoList
            class="t-flex-grow"
            :items="getProfileInfo(profile)"
          />
          <p class="t-text-xs t-opacity-70 t-mt-3">
            Keep these values up to date — if your weight or activity changes, your plan should change too.
          </p>
          <VBtn
            class="t-w-full t-mt-4"
            @click="isProfileEditing = true"
          >
            Edit my data
          </VBtn>
        </div>
      </a-card>

      <!-- GOAL -->
      <a-card class="v-card v-card--wide" :bordered="false">
        <div class="t-h-full">
          <h2 v-if="profileReady" class="t-text-xl t-font-semibold t-mb-2">Your goal</h2>

          <!-- goal form -->
          <div v-if="(!goal && profileReady) || isGoalEditing">
            <p class="t-text-sm t-opacity-70 t-mb-4">
              Specify your desired weight, activity level and a realistic deadline — we’ll calculate your calorie target and macro split.
            </p>
            <VForm
              v-slot="{ values }"
              :validation-schema="validationGoal"
              class="t-flex t-flex-col t-gap-4"
              @submit="onSubmitGoal"
            >
              <VFormInput
                name="weightTarget"
                label="Desired weight (kg)"
                type="number"
                :model-value="goal?.weightTarget || profile?.weightKg"
                @update:model-value="checkWeightWarnings(Number($event))"
              />
              
              <!-- Weight warning -->
              <div v-if="weightWarning" class="v-warning">
                <span class="t-text-amber-600">⚠️</span>
                <span>{{ weightWarning }}</span>
              </div>
              
              <!-- Healthy range hint -->
              <p v-if="healthyWeightRange.min" class="t-text-xs t-text-gray-500 -t-mt-2">
                Healthy weight for your height: {{ healthyWeightRange.min }}–{{ healthyWeightRange.max }} kg
              </p>
              <VFormSelect
                name="activityLevel"
                label="Activity Level"
                :options="[
                  { title: 'Sedentary lifestyle', id: 'sedentary' },
                  { title: 'Light activity', id: 'light' },
                  { title: 'Moderate activity', id: 'moderate' },
                  { title: 'High activity', id: 'active' },
                  { title: 'Almost daily sports', id: 'athlete' },
                ]"
                :model-value="goal?.activityLevel || 'moderate'"
              />
              <VFormDateSingle
                id="goal-deadline"
                name="deadline"
                label="Goal Deadline"
                :model-value="goal?.deadline"
              />
              <VBtn
                class="t-w-full t-mt-2"
                type="submit"
                :disabled="savingGoal"
              >
                Calculate and Save Goal
              </VBtn>
            </VForm>
          </div>

          <!-- show saved goal -->
          <div
            v-else-if="goal && profileReady"
            class="t-flex t-flex-col t-gap-4"
          >
            <section class="v-block">
              <div class="t-text-xs t-opacity-70 t-mb-1 ">
                Recommended daily intake
              </div>
              <div class="t-text-lg t-font-semibold t-mb-1 ">
                {{ Math.round(goal.dailyKcalTarget ?? goal.kcalTarget ?? 0) }} kcal
              </div>
              <div class="t-text-xs t-opacity-80 ">
                Protein: {{ goal.proteinTarget || 0 }} g · Carbs: {{ goal.carbsTarget || 0 }} g · Fats: {{ goal.fatTarget || 0 }} g
              </div>
              <div
                v-if="goalMeta"
                class="t-text-[11px] t-opacity-70 t-mt-2 "
              >
                Estimated weekly change: {{ goalMeta.weeklyKg }} kg/week · Horizon: ~{{ goalMeta.days }} days
              </div>
            </section>

            <section class="t-grid t-grid-cols-1 md:t-grid-cols-2 t-gap-4">
              <div class="v-block t-text-xs t-space-y-2">
                <div class="t-text-sm t-font-semibold ">Weight progress</div>
                <p>
                  We’ll show a more detailed trend here once you start tracking your weight regularly.
                </p>
                <p class="t-opacity-70">
                  We recommend updating your weight 2–3 times per week to get a smooth trend without being obsessed with daily fluctuations.
                </p>
              </div>

              <div class="v-block t-text-xs t-space-y-2">
                <div class="t-text-sm t-font-semibold ">Goal details</div>
                <InfoList :items="mapGoalInfo(goal)" />
              </div>
            </section>

            <section class="v-block t-text-xs t-space-y-2 ">
              <div class="t-text-sm t-font-semibold">Weekly checklist</div>
              <ul class="t-list-disc t-pl-4 t-space-y-1">
                <li>Log your meals at least 5 days this week.</li>
                <li>Hit your calorie target ±10% on 3+ days.</li>
                <li>Reach your protein goal on at least 3 days.</li>
                <li>Weigh yourself 2–3 times on different days.</li>
                <li>Do one small activity upgrade (stairs instead of elevator, short walk after dinner, etc.).</li>
              </ul>
            </section>

            <VBtn
              class="t-w-full t-mt-1"
              @click="isGoalEditing = true"
            >
              Edit Goal
            </VBtn>
          </div>

          <div v-else class="t-mt-[100px]">
            <a-result
              status="warning"
              title="To set a goal, you need to fill in your personal data first."
            />
          </div>
        </div>
      </a-card>

      <a-card class="v-card v-card--full " :bordered="false">
        <h2 class="t-text-lg t-font-semibold t-mb-2">Smart habits for your goal</h2>
        <p class="t-text-sm t-opacity-70 t-mb-3">
          Big changes come from small actions that you repeat daily. Here are a few habits that work for most goals:
        </p>
        <ul class="t-list-disc t-pl-4 t-space-y-1 t-text-xs">
          <li>Keep protein in every main meal (at least 20–30 g).</li>
          <li>Plan your meals ahead for the next day to avoid random snacking.</li>
          <li>Drink a glass of water with each meal and snack.</li>
          <li>Don’t chase perfection. Hitting your targets on 70–80% of days is already enough for progress.</li>
        </ul>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.v-goal-page {
  background-color: #f9fafb;
  color: #111827;
}

.v-goal-wrapper {
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
  background-color: #fff9;

  @apply t-rounded-2xl t-p-4;
}

h1,
h2,
h3 {
  color: #2563eb;
}

p {
  color: #4b5563;
}

.v-warning {
  @apply t-rounded-xl t-px-4 t-py-3 t-flex t-items-start t-gap-2 t-text-sm;
  background-color: #fffbeb;
  border: 1px solid #f59e0b;
  color: #92400e;
}
</style>
