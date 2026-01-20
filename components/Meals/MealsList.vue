<script setup lang="ts">
const props = defineProps({
  meals: {
    type: Array as () => Array<any>,
    default: () => [],
  },
})
const emit = defineEmits(['open', 'delete'])

const titles: Record<string,string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snacks',
}

const grouped = computed(() => {
  const g: Record<string, any[]> = { BREAKFAST:[], LUNCH:[], DINNER:[], SNACK:[] }
  for (const m of props.meals) {
    const arr = g[m.mealType]
    if (arr) arr.push(m)
  }
  return g
})
</script>

<template>
  <div class="t-space-y-5">
    <div
      v-for="type in ['BREAKFAST','LUNCH','DINNER','SNACK']"
      :key="type"
      class="v-card t-bg-cards t-rounded-3xl t-p-5"
    >
      <div class="t-flex t-justify-between t-items-center t-mb-3">
        <h3 class="t-text-base t-font-semibold">{{ titles[type] }}</h3>
        <span class="t-text-xs t-opacity-70">
          {{ (grouped[type] || []).reduce((a,m)=>a+m.kcal,0) }} kcal
        </span>
      </div>

      <div v-if="(grouped[type] || []).length === 0" class="t-text-sm t-opacity-70">
        No data yet
      </div>

      <ul class="t-space-y-3">
        <li
          v-for="m in grouped[type]"
          :key="m.id"
          class="t-rounded-2xl t-border t-border-secondaryStroke t-p-4 t-flex t-justify-between t-items-center"
        >
          <div>
            <div class="t-font-semibold">
              {{ new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
            <div class="t-text-xs t-opacity-70">
              {{ m.itemsJson?.length || 0 }} products · {{ Math.round(m.kcal) }} kcal
            </div>
          </div>
          <div class="t-flex t-gap-2">
            <VBtn view-mode="secondary" size="small" @click="$emit('open', m.id)">Open</VBtn>
            <VBtn view-mode="critical-secondary" size="small" @click="$emit('delete', m.id)">Delete</VBtn>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.t-btn { @apply t-text-xs t-rounded-xl t-px-3 t-py-1 t-bg-white/10 hover:t-opacity-80; }
</style>
