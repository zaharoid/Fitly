<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String as () => 'BREAKFAST'|'LUNCH'|'DINNER'|'SNACK', required: true },
})
const emit = defineEmits(['update:modelValue', 'created'])

const titles: Record<string,string> = {
  BREAKFAST: 'Завтрак',
  LUNCH: 'Обед',
  DINNER: 'Ужин',
  SNACK: 'Перекус',
}

const time = ref('08:00')
const grams = ref(100)
const query = ref('')
const results = ref<any[]>([])
const selected = ref<any | null>(null)
const error = ref<string | null>(null)

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
  const [hh, mm] = t.split(':').map(Number)
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
    error.value = 'Выбери продукт'
    return
  }
  if (!checkTimeRange(time.value)) {
    error.value = 'Время не подходит для этого приёма пищи'
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
      class="t-fixed t-inset-0 t-z-[200] t-flex t-items-center t-justify-center t-bg-black/60"
    >
      <div class="v-card t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-w-full t-max-w-lg t-p-6">
        <div class="t-flex t-justify-between t-items-center t-mb-4">
          <h2 class="t-text-lg t-font-semibold">
            {{ titles[mealType] }} — {{ date }}
          </h2>
          <button class="t-text-sm t-opacity-70" @click="close">Закрыть</button>
        </div>

        <div class="t-space-y-4">
          <div>
            <label class="t-text-xs t-opacity-70">Время*</label>
            <input
              v-model="time"
              type="time"
              class="t-input t-w-full"
            >
            <p class="t-text-[10px] t-opacity-60 t-mt-1">
              Завтрак: 05:00–11:00, Обед: 11:00–16:00, Ужин: 16:00–22:00. Перекус — любое время.
            </p>
          </div>

          <div>
            <label class="t-text-xs t-opacity-70">Поиск продукта*</label>
            <input
              v-model="query"
              class="t-input t-w-full"
              placeholder="Например, яблоко"
              @input="search"
            >
            <ul v-if="results.length" class="t-mt-2 t-max-h-40 t-overflow-y-auto t-space-y-1">
              <li
                v-for="p in results"
                :key="p.id"
                class="t-flex t-justify-between t-items-center t-bg-white/5 t-rounded-xl t-px-3 t-py-2 t-text-xs t-cursor-pointer"
                :class="selected?.id === p.id ? 't-bg-[var(--primary,#7c3aed)]/30' : ''"
                @click="selectProduct(p)"
              >
                <div>
                  <div class="t-font-semibold">{{ p.name }}</div>
                  <div class="t-opacity-70">
                    {{ Math.round(p.kcal) }} ккал / {{ p.servingQty || 100 }} г
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <label class="t-text-xs t-opacity-70">Граммовка*</label>
            <input
              v-model.number="grams"
              type="number"
              min="1"
              class="t-input t-w-full"
            >
          </div>

          <p v-if="error" class="t-text-xs t-text-red-400">{{ error }}</p>

          <div class="t-flex t-justify-end t-gap-2 t-mt-2">
            <button class="t-btn" @click="close">Отмена</button>
            <button class="t-btn t-bg-primary" @click="submit">
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.t-input {
  @apply t-bg-transparent t-border t-border-white/10 t-rounded-xl t-px-3 t-py-2 t-outline-none focus:t-border-primary;
}

.t-btn { @apply t-text-xs t-rounded-xl t-px-3 t-py-1 t-bg-white/10 hover:t-opacity-80; }
</style>
