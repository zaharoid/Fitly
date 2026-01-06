import vueMultiselect from 'vue-multiselect';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Multiselect', vueMultiselect);
});
