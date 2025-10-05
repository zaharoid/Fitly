import DOMPurify from 'dompurify';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('htmlsafe', (el, { value }) => {
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
      if ('target' in node) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    el.innerHTML = value ? DOMPurify.sanitize(String(value)) : '';
  });
});
