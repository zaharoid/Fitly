<script lang="ts" setup>
import type { Product } from '@prisma/client';

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    default: () => []
  }
})
</script>

<template>
  <div>
    <ul v-if="products.length" class="t-bg-white t-text-black t-p-4 t-rounded">
        <li v-for="singleProduct in products" :key="singleProduct.id">
            {{ singleProduct.name }} - {{ singleProduct.kcal }} kcal
        </li>
    </ul>
    <div v-else>
      <p class="t-text-2xl t-font-bold">No products found</p>
    </div>
  </div>
</template>