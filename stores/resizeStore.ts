import _ from 'lodash';
import { defineStore } from 'pinia';
import { utilBreakpoints } from '~/utils/breakpoints';

function getCurrentState () {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const useResizeStore = defineStore('resizeStore', () => {
  const width = ref<number>(0);
  const height = ref<number>(0);

  function onResize () {
    const { width: newWight, height: newHeight } = getCurrentState();
    width.value = newWight;
    height.value = newHeight;
  }

  const onResizeThrottled = _.throttle(onResize, 500);

  // MQ Getters work like css media requsts. Example of use in component:
  // value 'fromDevice' will be true if the size more then 'device'
  // or false if less 'device'
  const mqComputedObj: { [key: string]: ComputedRef } = {};
  Object.entries(utilBreakpoints).forEach(([name, val]) => {
    mqComputedObj[`from_${name}`] = computed(() => (val <= width.value)); // example name: mq.from_sm
    mqComputedObj[`until_${name}`] = computed(() => (val > width.value)); // example name: mq.until_sm
  });

  return {
    width,
    height,
    onResize,
    onResizeThrottled,
    mq: mqComputedObj,
  };
});
