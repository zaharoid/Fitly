import DOMPurify from 'dompurify';
import * as dom from '~/utils/domElements';

interface TooltipModifiers {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  holderSize?: boolean;
  aboveAll?: boolean;
  ignoreTooltipHover?: boolean;
}

type Value = string|{ text: string }|null;

interface Binding {
  modifiers: TooltipModifiers,
  value: Value,
}

const optionsModifier: ('top'|'bottom'|'left'|'right')[] = ['top', 'bottom', 'left', 'right'];

type TipData = {
  tooltipEl: HTMLElement;
  animTimeout: ReturnType<typeof setTimeout>|null;
  binding: Binding;
  onShowTooltip: (this: HTMLElement, ev: MouseEvent | FocusEvent) => any,
  onHideTooltip: (this: HTMLElement, ev: MouseEvent | FocusEvent) => any,
}

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;
  const tipDataMap = new Map<HTMLElement, TipData>();

  function formattedContent (value: Value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text) return value.text;
    return '';
  }

  function updateTooltipEl (tooltipEl: HTMLElement, binding: Binding) {
    const { value, modifiers } = binding;
    optionsModifier.forEach((key) => {
      if (modifiers[key]) {
        tooltipEl.classList.add(`o-tooltip--${key}`);
      } else {
        tooltipEl.classList.remove(`o-tooltip--${key}`);
      }
    });
    const content = formattedContent(value);
    const contentEl = tooltipEl.getElementsByClassName('js-tooltip-content')[0];
    contentEl.innerHTML = DOMPurify.sanitize(content);
  }

  function sizingTooltipEl (tooltipEl: HTMLElement, el: HTMLElement, modifiers: TooltipModifiers) {
    tooltipEl.style.maxWidth = '';
    if ((modifiers.bottom || modifiers.top) && modifiers.holderSize) {
      tooltipEl.style.maxWidth = `${Math.max(dom.utilGetElemSize(el).width, 150)}px`;
    }
  }

  function positionTooltipEl (tooltipEl: HTMLElement, el: HTMLElement, modifiers: TooltipModifiers) {
    const elPos = dom.utilGetElemPos(el);
    const elSize = dom.utilGetElemSize(el);
    const tooltipElSize = dom.utilGetElemSize(tooltipEl);

    const getHorizontalTop = () => `${elPos.top + (elSize.height - tooltipElSize.height) / 2}px`;
    const getVerticalLeft = () => `${elPos.left + (elSize.width - tooltipElSize.width) / 2}px`;

    tooltipEl.style.left = '';
    tooltipEl.style.top = '';

    if (modifiers.bottom) {
      tooltipEl.style.left = getVerticalLeft();
      tooltipEl.style.top = `${elPos.top + elSize.height}px`;
    } else if (modifiers.left) {
      tooltipEl.style.left = `${elPos.left - tooltipElSize.width}px`;
      tooltipEl.style.top = getHorizontalTop();
    } else if (modifiers.right) {
      tooltipEl.style.left = `${dom.utilGetElemPos(el).right}px`;
      tooltipEl.style.top = getHorizontalTop();
    } else {
      tooltipEl.style.left = getVerticalLeft();
      tooltipEl.style.top = `${elPos.top - tooltipElSize.height}px`;
    }
  }

  function createTipData (el: HTMLElement, binding: Binding) {
    const { modifiers } = binding;
    const tooltipEl = document.createElement('div');
    const tooltipElInner = document.createElement('div');
    tooltipElInner.classList.add('o-tooltip__inner');
    tooltipElInner.classList.add('js-tooltip-content');
    tooltipEl.classList.add('o-tooltip');
    if (modifiers.aboveAll) tooltipEl.classList.add('t-z-aboveAll');
    tooltipEl.appendChild(tooltipElInner);
    updateTooltipEl(tooltipEl, binding);

    const savedObj: TipData = {
      tooltipEl,
      animTimeout: null,
      binding,
      onShowTooltip () {
        showTooltip(el, savedObj);
      },
      onHideTooltip (event: any) {
        let hoveredEls = [el];
        if (!modifiers.ignoreTooltipHover) hoveredEls = [savedObj.tooltipEl, el];
        if (event?.toElement &&
          hoveredEls.some(my => my.contains(event.toElement))) return;
        hideTooltip(savedObj);
      },
    };

    tipDataMap.set(el, savedObj);
    el.addEventListener('mouseenter', savedObj.onShowTooltip);
    el.addEventListener('focus', savedObj.onShowTooltip);
    el.addEventListener('mouseleave', savedObj.onHideTooltip);
    el.addEventListener('blur', savedObj.onHideTooltip);
    tooltipEl.addEventListener('mouseleave', savedObj.onHideTooltip);
  }

  function removeTipData (el: HTMLElement) {
    const tip = tipDataMap.get(el);
    if (!tip) return;
    el.removeEventListener('mouseenter', tip.onShowTooltip);
    el.removeEventListener('focus', tip.onShowTooltip);
    el.removeEventListener('mouseleave', tip.onHideTooltip);
    el.removeEventListener('blur', tip.onHideTooltip);
    tip.tooltipEl.removeEventListener('mouseleave', tip.onHideTooltip);
    tip.tooltipEl?.remove();
    tipDataMap.delete(el);
  }

  function showTooltip (el: HTMLElement, tip: TipData) {
    const { modifiers } = tip.binding;
    document.body.appendChild(tip.tooltipEl);
    // tooltipEl.style.maxWidth = getHolderMaxWidth();
    sizingTooltipEl(tip.tooltipEl, el, modifiers);
    setTimeout(() => {
      positionTooltipEl(tip.tooltipEl, el, modifiers);
    });
    tip.tooltipEl?.classList.add('o-tooltip--show');

    if (tip.animTimeout) {
      clearTimeout(tip.animTimeout);
      tip.animTimeout = null;
    }
  }

  function hideTooltip (tip: TipData) {
    tip.tooltipEl.classList.remove('o-tooltip--show');

    if (tip.animTimeout) clearTimeout(tip.animTimeout);
    tip.animTimeout = setTimeout(() => {
      tip.tooltipEl?.remove();
      tip.animTimeout = null;
    }, 300);
  }

  vueApp.directive('tooltip', {
    mounted (el: HTMLElement, binding) {
      if (!binding.value) return;
      createTipData(el, binding);
    },
    updated (el, binding) {
      const tip = tipDataMap.get(el);
      if (binding.value && tip) {
        updateTooltipEl(tip.tooltipEl, binding);
        tip.binding = binding;
      } else if (binding.value && !tip) {
        createTipData(el, binding);
      } else if (!binding.value && tip) {
        removeTipData(el);
      }
    },
    beforeUnmount (el) {
      removeTipData(el);
    },
    getSSRProps () {
      return {};
    },
  });
});
