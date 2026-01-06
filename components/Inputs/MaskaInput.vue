<script setup lang="ts">
import type { MaskInputOptions } from 'maska';


const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  options: {
    type: Object as PropType<MaskInputOptions>,
    default: () => ({}),
  },
});
const emit = defineEmits(['input', 'blur']);

const emitedVal = ref('');

watchEffect(() => { emitedVal.value = props.value; });

function onInput (event: Event) {
  if (event?.constructor?.name !== 'CustomEvent') return;
  const myTarget = event.target as HTMLInputElement;
  if (emitedVal.value === myTarget.value) return;
  emitedVal.value = myTarget.value;
  emit('input', event);
}
</script>
<template>
  <input
    v-maska:[props.options]
    :value="props.value"
    @input="onInput"
    @blur="$emit('blur', $event)"
  >
</template>
