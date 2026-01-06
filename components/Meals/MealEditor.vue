<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  meal: {
    type: Object as () => any,
    default: () => null,
  },
})

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'change-type', val: string): void
}>()

// локальное состояние
const localItems = ref<any[]>([])
const localMealType = ref<'BREAKFAST'|'LUNCH'|'DINNER'|'SNACK'>('BREAKFAST')
const localTime = ref('08:00')

// добавление продукта
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedProduct = ref<any | null>(null)
const grams = ref<number | null>(100)
const addError = ref<string | null>(null)

const validationMeta = {
  mealType: 'required',
  time: 'required',
}

// инициализация из props.meal
watch(
  () => props.meal,
  (m) => {
    if (!m) return
    localItems.value = Array.isArray(m.itemsJson)
      ? JSON.parse(JSON.stringify(m.itemsJson))
      : []
    localMealType.value = m.mealType || 'BREAKFAST'
    const d = new Date(m.time)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    localTime.value = `${hh}:${mm}`
  },
  { immediate: true }
)

const totals = computed(() =>
  localItems.value.reduce(
    (a: any, x: any) => {
      a.kcal += x.kcal || 0
      a.p += x.protein || 0
      a.c += x.carbs || 0
      a.f += x.fat || 0
      return a
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  )
)

const mealTypeOptions = [
  { label: 'Завтрак', value: 'BREAKFAST' },
  { label: 'Обед', value: 'LUNCH' },
  { label: 'Ужин', value: 'DINNER' },
  { label: 'Перекус', value: 'SNACK' },
]

// -------------------- search & add product --------------------

async function searchProducts() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    selectedProduct.value = null
    return
  }
  const res = await $fetch('/api/products/search', {
    query: { q: searchQuery.value },
  })
  searchResults.value = res.items || []
}

function selectProduct(p: any) {
  selectedProduct.value = p
}

// диапазоны времени — чтобы пользователь не ставил «завтрак» в 23:00
function isTimeAllowed(hh: number, mm: number, type: string) {
  const mins = hh * 60 + mm
  if (type === 'BREAKFAST') return mins >= 5 * 60 && mins <= 11 * 60    // 05:00–11:00
  if (type === 'LUNCH')     return mins >= 11 * 60 && mins <= 16 * 60   // 11:00–16:00
  if (type === 'DINNER')    return mins >= 16 * 60 && mins <= 22 * 60   // 16:00–22:00
  if (type === 'SNACK')     return true
  return true
}

function parseTimeStr(t: string) {
  const [hh, mm] = t.split(':').map(Number)
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null
  return { hh, mm }
}

async function addToItems() {
  addError.value = null
  if (!selectedProduct.value) {
    addError.value = 'Выбери продукт из списка'
    return
  }
  if (!grams.value || grams.value <= 0) {
    addError.value = 'Укажи граммовку'
    return
  }

  const parsed = parseTimeStr(localTime.value)
  if (!parsed) {
    addError.value = 'Некорректное время'
    return
  }
  if (!isTimeAllowed(parsed.hh, parsed.mm, localMealType.value)) {
    addError.value = 'Время не подходит для этого типа приёма'
    return
  }

  const p = selectedProduct.value
  const baseQty = p.servingQty || 100
  const ratio = (grams.value || baseQty) / baseQty

  localItems.value.push({
    productId: p.id,
    name: p.name,
    grams: grams.value,
    kcal: Math.round((p.kcal || 0) * ratio),
    protein: Math.round((p.protein || 0) * ratio),
    carbs: Math.round((p.carbs || 0) * ratio),
    fat: Math.round((p.fat || 0) * ratio),
  })

  // сбрасываем только продукт и запрос, граммовку можно оставить
  selectedProduct.value = null
  searchQuery.value = ''
  searchResults.value = []
}

// -------------------- remove & save --------------------

function removeItem(index: number) {
  localItems.value.splice(index, 1)
}

async function onSubmitMeta(values: { mealType: string; time: string }) {
  // значения из VForm прилетают сюда, обновим локальные
  localMealType.value = values.mealType as any
  localTime.value = values.time

  if (!props.meal) return

  const parsed = parseTimeStr(localTime.value)
  let newTime = new Date(props.meal.time)
  if (parsed) {
    newTime = new Date(props.meal.date)
    newTime.setUTCHours(parsed.hh, parsed.mm, 0, 0)
  }

  const body = {
    mealId: props.meal.id,
    items: localItems.value,
    mealType: localMealType.value,
    time: newTime.toISOString(),
  }

  await $fetch('/api/meals/update', {
    method: 'PUT',
    body,
  })

  emit('change-type', localMealType.value)
  emit('save')
}
</script>

<template>
  <div v-if="meal" class="t-space-y-4">
    <!-- Форма мета-данных приёма: тип и время -->
    <VForm
      :validation-schema="validationMeta"
      class="t-flex t-flex-col t-gap-4"
      @submit="onSubmitMeta"
    >
      <div class="t-flex t-flex-col md:t-flex-row t-gap-4">
        <div class="t-flex-1">
          <VFormSelect
            name="mealType"
            label="Тип приёма"
            :options="mealTypeOptions"
            :model-value="localMealType"
            @update:modelValue="val => (localMealType = val as any)"
          />
        </div>
        <div class="t-w-full md:t-w-48">
          <VFormInput
            name="time"
            label="Время"
            type="time"
            :model-value="localTime"
            @update:modelValue="val => (localTime = val as string)"
          />
        </div>
      </div>

      <!-- Блок добавления продукта -->
      <div class="t-panel">
        <div class="t-text-sm t-opacity-70 t-mb-3">
          Добавить продукт в этот приём
        </div>

        <div class="t-flex t-flex-col lg:t-flex-row t-gap-3 t-items-start">
          <!-- Поиск продукта -->
          <div class="t-flex-1">
            <label class="t-label">Поиск продукта</label>
            <input
              v-model="searchQuery"
              class="t-input t-w-full"
              placeholder="Например, куриная грудка"
              @input="searchProducts"
            >
            <ul
              v-if="searchResults.length"
              class="t-mt-2 t-max-h-40 t-overflow-y-auto t-space-y-1"
            >
              <li
                v-for="p in searchResults"
                :key="p.id"
                class="t-result-item"
                :class="selectedProduct?.id === p.id ? 't-result-item--active' : ''"
                @click="selectProduct(p)"
              >
                <div>
                  <div class="t-text-xs t-font-semibold">{{ p.name }}</div>
                  <div class="t-text-[10px] t-opacity-70">
                    {{ Math.round(p.kcal) }} ккал / {{ p.servingQty || 100 }} г
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="t-w-full lg:t-w-32">
            <VFormInput
              name="gramsLocal"
              label="Грамм"
              type="number"
              :model-value="grams"
              @update:modelValue="val => (grams = val ? Number(val) : null)"
            />
          </div>
          <div class="t-flex t-items-end">
            <button
              type="button"
              class="t-btn-main"
              @click="addToItems"
            >
              + Добавить
            </button>
          </div>
        </div>
        <p v-if="addError" class="t-text-xs t-text-red-400 t-mt-2">
          {{ addError }}
        </p>
      </div>
      <div class="t-panel">
        <div class="t-flex t-justify-between t-items-center t-mb-3">
          <div class="t-text-sm t-opacity-70">
            Продукты ({{ localItems.length }})
          </div>
          <div class="t-text-xs">
            Итого: {{ totals.kcal }} ккал · Б {{ totals.p }} · У {{ totals.c }} · Ж {{ totals.f }}
          </div>
        </div>

        <div v-if="!localItems.length" class="t-text-sm t-opacity-60">
          Пока нет продуктов. Добавь хотя бы один.
        </div>

        <ul class="t-space-y-2">
          <li
            v-for="(it, idx) in localItems"
            :key="idx"
            class="t-item-row"
          >
            <div>
              <div class="t-font-semibold t-text-xs">
                {{ it.name }}
              </div>
              <div class="t-text-[10px] t-opacity-70">
                {{ it.grams || 0 }} г · {{ it.kcal }} ккал · Б {{ it.protein }} · У {{ it.carbs }} · Ж {{ it.fat }}
              </div>
            </div>
            <button
              type="button"
              class="t-btn-danger"
              @click="removeItem(idx)"
            >
              Удалить
            </button>
          </li>
        </ul>
      </div>
      <div class="t-flex t-justify-end">
        <VBtn
          type="submit"
          class="t-w-full md:t-w-auto"
        >
          Сохранить приём
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<style scoped>
.t-panel {
  @apply t-bg-[var(--panel,#171a1f)] t-rounded-3xl t-p-4;
}

.t-label {
  @apply t-block t-text-xs t-opacity-70 t-mb-1;
}

.t-input {
  @apply t-bg-transparent t-border t-border-white/10 t-rounded-xl t-px-3 t-py-2 t-outline-none focus:t-border-[var(--primary,#7c3aed)];
}

.t-result-item {
  @apply t-bg-white/5 t-rounded-xl t-px-3 t-py-2 t-flex t-items-center t-justify-between t-text-xs t-cursor-pointer hover:t-bg-white/10;
}

.t-result-item--active {
  @apply t-bg-[var(--primary,#7c3aed)]/40;
}

.t-btn-main {
  @apply t-text-xs t-rounded-xl t-px-4 t-py-2 t-bg-[var(--primary,#7c3aed)] hover:t-opacity-90;
}

.t-item-row {
  @apply t-bg-white/5 t-rounded-2xl t-px-4 t-py-3 t-flex t-justify-between t-items-center;
}

.t-btn-danger {
  @apply t-text-[10px] t-rounded-xl t-px-3 t-py-1 t-bg-red-500/20 hover:t-bg-red-500/30;
}
</style>
