<script setup lang="ts">
import { useOnCopyValue } from '~/compasables/helper/useOnCopy';
import type { InfoItem } from '~t/InfoList';

const props = defineProps({
  items: {
    type: Array as PropType<InfoItem[]>,
    default: () => [],
  },
  viewMode: {
    type: String as PropType<''|'limited'>,
    default: null,
  },
});

const { width } = useWindowSize();

const tooltipDirection = computed(() => {
  if (width.value > 1100) return 'right';
  return 'left';
});

</script>
<template>
  <div
    class="o-field v-info-list"
    :class="{ [`v-info-list--${props.viewMode}`]: props.viewMode }"
  >
    <table class="v-info-list__table">
      <colgroup>
        <col :style="{ width: '35%', minWidth: '120px' }">
      </colgroup>
      <tbody>
        <tr
          v-for="row in props.items"
          :key="row.id"
          class="v-info-list__row"
        >
          <td class="v-info-list__cell t-pr-2">
            <p
              class="t-text-base t-text-secondaryText"
              :data-test="`info-list-title-${row.id}`"
            >
              {{ row.title }}
            </p>
          </td>
          <td class="v-info-list__cell">
            <div
              v-if="row.mode === 'text' || !row.mode"
              class="v-info-list__inner-description"
            >
              <div class="t-flex t-items-center t-gap-1">
                <p
                  class="t-grow t-truncate t-whitespace-pre-wrap t-max-w-[180px] sm:t-max-w-[260px] md:t-max-w-[230px] lg:t-max-w-none"
                  :class="[row.classNames ?? 't-text-text t-text-base t-font-bold']"
                  :data-test="`info-list-description-${row.id}`"
                >
                  {{ row.description }}
                </p>
                <i
                  v-if="row?.tooltip?.text && tooltipDirection === 'right'"
                  v-tooltip.right="row.tooltip.text"
                  class="icon-item-circle-info t-text-secondaryText t-ml-1"
                />
                <i
                  v-if="row?.tooltip?.text && tooltipDirection === 'left'"
                  v-tooltip.left="row.tooltip.text"
                  class="icon-item-circle-info t-text-secondaryText t-ml-1"
                />
              </div>
              <button
                v-if="row.copiedContent"
                type="button"
                class="o-iconed-btn icon-action-copy t-m-[3px]"
                aria-label="Copy content"
                @click="useOnCopyValue(row.copiedContent || '')"
              />
            </div>
            <div v-else-if="row.mode === 'link'">
              <a
                :href="row.content?.link"
                :target="row.content?.target"
                class="t-text-secondaryItems t-underline"
              >
                {{ row.content?.title || 'link' }}
              </a>
            </div>
            <InfoListItemFiles
              v-else-if="row.mode === 'files'"
              :title="row.content?.title"
              :items="row.content?.items"
            />

            <CellItemType
              v-else-if="row.mode === 'cellItemType'"
              :badge="{
                ...row.content,
                size: 'small',
              }"
              is-big-title
              :title="row.content?.title"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss">
.v-info-list {
  $self: &;

  &__table {
    margin-bottom: theme('spacing.-1');
    margin-top: theme('spacing.-1');
  }

  &__cell {
    padding-bottom: theme('spacing.1');
    padding-top: theme('spacing.1');
    vertical-align: top;
  }

  &__inner-description {
    align-items: flex-start;
    display: flex;
  }

  &--limited {

    #{$self}__table {
      max-width: 600px;
    }
  }
}
</style>
