<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String as () => 'BREAKFAST'|'LUNCH'|'DINNER'|'SNACK', required: true },
})
const emit = defineEmits(['update:modelValue', 'created'])

const titles: Record<string,string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
}

const time = ref('08:00')
const grams = ref(100)
const query = ref('')
const results = ref<any[]>([])
const selected = ref<any | null>(null)
const error = ref<string | null>(null)

// Overeating warnings
const MEAL_KCAL_WARNING = 800 // Warning threshold for a single meal
const MEAL_KCAL_DANGER = 1500 // Danger threshold
const PORTION_GRAMS_WARNING = 500 // Large portion warning

const calculatedKcal = computed(() => {
  if (!selected.value) return 0
  const baseQty = selected.value.servingQty || 100
  return Math.round((selected.value.kcal * grams.value) / baseQty)
})

const mealWarning = computed(() => {
  const warnings: string[] = []
  
  if (calculatedKcal.value > MEAL_KCAL_DANGER) {
    warnings.push(`⛔ ${calculatedKcal.value} kcal is extremely high for one meal! Consider splitting into portions.`)
  } else if (calculatedKcal.value > MEAL_KCAL_WARNING) {
    warnings.push(`⚠️ ${calculatedKcal.value} kcal is quite high for a single meal.`)
  }
  
  if (grams.value > PORTION_GRAMS_WARNING) {
    warnings.push(`⚠️ ${grams.value}g is a large portion. Are you sure?`)
  }
  
  // Specific nutrient warnings
  if (selected.value) {
    const baseQty = selected.value.servingQty || 100
    const ratio = grams.value / baseQty
    const protein = Math.round(selected.value.protein * ratio)
    const fat = Math.round(selected.value.fat * ratio)
    const carbs = Math.round(selected.value.carbs * ratio)
    
    if (fat > 50) {
      warnings.push(`High fat content (${fat}g). Consider moderating.`)
    }
    if (carbs > 150) {
      warnings.push(`Very high carbs (${carbs}g). Watch your intake.`)
    }
  }
  
  return warnings
})

const canSubmit = computed(() => {
  // Block submission only for extremely high calories
  return calculatedKcal.value <= MEAL_KCAL_DANGER * 1.5 // Allow up to 2250 kcal max
})

watch(() => props.modelValue, (open) => {
  if (open) {
    error.value = null
    selected.value = null
    query.value = ''
    results.value = []
    if (props.mealType === 'BREAKFAST') time.value = '08:00'
    if (props.mealType === 'LUNCH') time.value = '13:00'
    if (props.mealType === 'DINNER') time.value = '19:00'
    if (props.mealType === 'SNACK') time.value = '11:00'
  }
})

function close() {
  emit('update:modelValue', false)
}

async function search() {
  if (!query.value.trim()) { results.value = []; return }
  const r = await $fetch('/api/products/search', { query: { q: query.value } })
  results.value = r.items || []
}

function selectProduct(p: any) {
  selected.value = p
}

function checkTimeRange(t: string) {
  const parts = t.split(':').map(Number)
  const hh = parts[0] ?? 0
  const mm = parts[1] ?? 0
  const mins = hh * 60 + mm
  if (props.mealType === 'BREAKFAST') return mins >= 5*60 && mins <= 11*60
  if (props.mealType === 'LUNCH') return mins >= 11*60 && mins <= 16*60
  if (props.mealType === 'DINNER') return mins >= 16*60 && mins <= 22*60
  if (props.mealType === 'SNACK') return true
  return true
}

async function submit() {
  error.value = null
  if (!selected.value) {
    error.value = 'Select a product'
    return
  }
  if (!checkTimeRange(time.value)) {
    error.value = 'Time does not fit this meal type'
    return
  }
  const p = selected.value
  const baseQty = p.servingQty || 100
  const ratio = (grams.value || baseQty) / baseQty

  const item = {
    productId: p.id,
    name: p.name,
    grams: grams.value,
    kcal: Math.round(p.kcal * ratio),
    protein: Math.round(p.protein * ratio),
    carbs: Math.round(p.carbs * ratio),
    fat: Math.round(p.fat * ratio),
  }

  const res = await $fetch('/api/meals/create', {
    method: 'POST',
    body: {
      date: props.date,
      time: time.value,
      mealType: props.mealType,
      item,
    },
  })

  emit('created', res.meal)
  close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="t-fixed t-inset-0 t-z-[200] t-flex t-items-center t-justify-center t-bg-black/40"
      @click.self="close"
    >
      <div class="v-dialog">
        <div class="t-flex t-justify-between t-items-center t-mb-4">
          <h2 class="t-text-xl t-font-semibold t-text-blue-600">
            {{ titles[mealType] }} — {{ date }}
          </h2>
          <button class="t-text-sm t-text-gray-500 hover:t-text-gray-700" @click="close">✕</button>
        </div>

        <div class="t-space-y-4">
          <!-- Time input -->
          <div>
            <label class="t-text-xs t-font-medium t-text-gray-600">Time*</label>
            <input
              v-model="time"
              type="time"
              class="v-input t-w-full t-mt-1"
            >
            <p class="t-text-[10px] t-text-gray-400 t-mt-1">
              Breakfast: 05:00–11:00, Lunch: 11:00–16:00, Dinner: 16:00–22:00. Snack — any time.
            </p>
          </div>

          <!-- Search -->
          <div>
            <label class="t-text-xs t-font-medium t-text-gray-600">Search product*</label>
            <input
              v-model="query"
              class="v-input t-w-full t-mt-1"
              placeholder="E.g., apple, chicken, rice..."
              @input="search"
            >

            <!-- Search results -->
            <ul v-if="results.length && !selected" class="t-mt-3 t-max-h-48 t-overflow-y-auto t-space-y-2">
              <li
                v-for="p in results"
                :key="p.id"
                class="v-product-item"
                @click="selectProduct(p)"
              >
                <div class="t-flex t-justify-between t-items-center">
                  <div>
                    <div class="t-font-semibold t-text-gray-800">{{ p.name }}</div>
                    <div class="t-text-xs t-text-gray-500">
                      {{ Math.round(p.kcal) }} kcal / {{ p.servingQty || 100 }} g
                    </div>
                  </div>
                  <span class="t-text-xs t-text-blue-500 t-font-medium">Select →</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Selected product -->
          <div v-if="selected" class="v-selected-product">
            <div class="t-flex t-justify-between t-items-start">
              <div>
                <div class="t-text-xs t-font-medium t-text-green-600 t-mb-1">✓ Selected product</div>
                <div class="t-font-semibold t-text-gray-800 t-text-lg">{{ selected.name }}</div>
                <div class="t-text-sm t-text-gray-500 t-mt-1">
                  {{ Math.round(selected.kcal) }} kcal · {{ Math.round(selected.protein) }}g protein · {{ Math.round(selected.carbs) }}g carbs · {{ Math.round(selected.fat) }}g fat
                </div>
                <div class="t-text-xs t-text-gray-400 t-mt-1">
                  per {{ selected.servingQty || 100 }} g
                </div>
              </div>
              <button
                class="t-text-xs t-text-red-500 hover:t-text-red-700 t-font-medium"
                @click="selected = null"
              >
                Change
              </button>
            </div>
          </div>

          <!-- Grams -->
          <div>
            <label class="t-text-xs t-font-medium t-text-gray-600">Grams*</label>
            <input
              v-model.number="grams"
              type="number"
              min="1"
              class="v-input t-w-full t-mt-1"
            >
            <p v-if="selected" class="t-text-xs t-text-gray-400 t-mt-1">
              ≈ {{ Math.round((selected.kcal * grams) / (selected.servingQty || 100)) }} kcal for {{ grams }}g
            </p>
          </div>

          <p v-if="error" class="t-text-sm t-text-red-500 t-font-medium">{{ error }}</p>

          <!-- Overeating warnings -->
          <div v-if="mealWarning.length > 0" class="v-meal-warnings">
            <div v-for="(warning, idx) in mealWarning" :key="idx" class="t-text-sm">
              {{ warning }}
            </div>
          </div>

          <div class="t-flex t-justify-end t-gap-3 t-mt-4 t-pt-4 t-border-t t-border-gray-100">
            <VBtn variant="secondary" @click="close">Cancel</VBtn>
            <VBtn :disabled="!canSubmit" @click="submit">Add meal</VBtn>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.v-dialog {
  background-color: #fff;
  border-radius: theme('borderRadius.2xl');
  box-shadow: 0 20px 50px #00000026;
  color: #111827;
  max-width: 480px;
  padding: theme('spacing.6');
  width: 100%;
}

.v-input {
  @apply t-border t-rounded-xl t-px-3 t-py-2 t-outline-none;
  background-color: #fff;
  border-color: #e5e7eb;
  color: #111827;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px #2563eb1a;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.v-product-item {
  @apply t-rounded-xl t-px-4 t-py-3 t-cursor-pointer;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all .15s ease;

  &:hover {
    background-color: #eff6ff;
    border-color: #2563eb;
    box-shadow: 0 2px 8px #2563eb1a;
  }
}

.v-selected-product {
  @apply t-rounded-xl t-px-4 t-py-3;
  background-color: #f0fdf4;
  border: 2px solid #22c55e;
}

.v-meal-warnings {
  @apply t-rounded-xl t-px-4 t-py-3 t-space-y-1;
  background-color: #fffbeb;
  border: 1px solid #f59e0b;
  color: #92400e;
}
</style>
