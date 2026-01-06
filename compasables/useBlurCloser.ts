import {
  useActiveElement,
  onClickOutside,
} from '@vueuse/core';

// functions that help with onBlur closing
// of Dropdown menu
// or whatever that should close
// if focus no longer on the elements of this window

interface Args {
  elTrigger: Ref<HTMLElement | null>;
  elDropdown: Ref<HTMLElement | null>;
  opened: Ref<boolean>;
  onClose: () => void;
}

export const useBlurCloser = (args: Args) => {
  const {
    elTrigger,
    elDropdown,
    opened,
    onClose,
  } = args;
  const activeEl = useActiveElement();

  function closeByOutsidePreventBody (el: Element | null | undefined) {
    if (el === document.body) return;
    closeByOutside(el);
  }

  function closeByOutside (el: Element | null | undefined) {
    if (!elDropdown.value || !elTrigger.value || !el) return;
    if (elDropdown.value.contains(el) || elTrigger.value.contains(el)) return;
    onClose();
  }

  let unwatchActiveEl = () => {};
  let unwatchClickOutside: (() => void) | undefined = () => {};

  function startWatchBlur () {
    unwatchActiveEl = watch(activeEl, closeByOutsidePreventBody);
    unwatchClickOutside = onClickOutside(elDropdown, (event) => {
      closeByOutside(event.target as HTMLElement);
    });
  }

  function endWatchBlur () {
    unwatchActiveEl();
    if (unwatchClickOutside) unwatchClickOutside();
  }

  watch(opened, (val) => {
    val ? startWatchBlur() : endWatchBlur();
  });

  onUnmounted(() => endWatchBlur);
};
