import { useClipboard } from '@vueuse/core';
import { useAlertsStore } from '~/stores/alertsStore';

export const useOnCopyValue = (copyValue: string) => {
  const { copy } = useClipboard();
  const store = useAlertsStore();

  copy(copyValue);

  store.addMessage({
    title: 'Text was copied',
    mode: 'success',
    showCloseButton: false,
  });
};
