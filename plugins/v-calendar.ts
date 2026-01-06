import { setupCalendar, Calendar, DatePicker } from 'v-calendar';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(setupCalendar, {});
  nuxtApp.vueApp.component('VCalendar', Calendar);
  nuxtApp.vueApp.component('VDatePicker', DatePicker);
});
