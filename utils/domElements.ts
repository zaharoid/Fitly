type RelatedSide = {
  x?: 'left'|'right'
  y?: 'top'|'bottom'
}

type Attrs = { [key: string]: any }

// 1. GET params of elements

export function utilGetElemPosRelScreen (elem: HTMLElement, screenSide?: RelatedSide) {
  const {
    x = 'left',
    y = 'top',
  } = screenSide || {};

  let { top, bottom, left, right } = elem.getBoundingClientRect();
  if (x === 'right') {
    const windowWidth = window.innerWidth;
    left -= windowWidth;
    right -= windowWidth;
  }
  if (y === 'bottom') {
    const windowHeight = window.innerHeight;
    top -= windowHeight;
    bottom -= windowHeight;
  }
  return { top, bottom, left, right };
}

export function utilGetElemSize (elem: HTMLElement) {
  const { width, height } = elem.getBoundingClientRect();
  return { width, height };
}

export function utilGetElemPos (elem: HTMLElement) {
  const { top, bottom, left, right } = elem.getBoundingClientRect();
  const { scrollX, scrollY } = window;

  return {
    top: top + scrollY,
    bottom: bottom + scrollY,
    left: left + scrollX,
    right: right + scrollX,
  };
}

// 2. create elements

export function createNewElement (tagName = 'div', attrObj: Attrs = {}) {
  const newElement = document.createElement(tagName);
  Object.entries(attrObj).forEach(([key, val]) => {
    newElement.setAttribute(key, val);
  });
  return newElement;
}
