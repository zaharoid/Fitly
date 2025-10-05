<script setup lang="ts">
import type * as Btn from '~t/Btn';
import {
  btnTypeOptions,
  viewModeOptions,
} from '~t/Btn';

const props = defineProps({
  type: {
    type: String as PropType<Btn.BtnType>,
    default: 'button',
    validator: (val: Btn.BtnType) => btnTypeOptions.includes(val),
  },
  viewMode: {
    type: String as PropType<Btn.BtnViewMode>,
    default: 'primary',
    validator: (val: Btn.BtnViewMode) => viewModeOptions.includes(val),
  },
  icon: {
    type: Object as PropType<{
      name: string;
      sizeClass?: string;
      position?: 'left'|'right';
    } | null>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{(e: 'click', event: Event): void}>();
</script>
<template>
  <button
    class="o-btn"
    :class="{
      [`o-btn--${props.viewMode}`]: props.viewMode,
      'o-btn--i-right': icon?.position === 'right',
    }"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <i
      v-if="icon?.name"
      class="o-btn__icon"
      :class="[
        `icon-${icon.name}`,
        icon.sizeClass ? icon.sizeClass : 't-text-sm',
      ]"
    />
    <span>
      <slot />
    </span>
  </button>
</template>
