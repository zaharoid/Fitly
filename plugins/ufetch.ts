import type { NitroFetchOptions } from 'nitropack';
// import { utilGetSessionTokenHeader } from '~/utils/sessionTokenHeader';
// import { utilGetPageAccesses } from '~/utils/pageAccesses';
// import { useForceLogout } from '~x/featureRequests/useRequestLogout';

interface UfetchOptions extends NitroFetchOptions<string> {
  disableInterceptors?: boolean
}

export default defineNuxtPlugin((nuxtApp: unknown) => {
  function interceptorsUFetch (data: { [key: string]: unknown }) {
    // const updatePrivacyPolicy = data?.response?.status === 451;
    // const doLogout = data?.response?.status === 401;
    // const route = nuxtApp.$router.currentRoute;
    // const thisPageAccesses = utilGetPageAccesses(route?.meta?.authAccess as string);
    // if (process.client && doLogout) {
    //   if (route.value.name === 'signin') return;
    //   useForceLogout({ issueType: 'token', pageAccesses: thisPageAccesses });
    // }
    // if (process.client && updatePrivacyPolicy) {
    //   usePrivacyPolicyBlock();
    // }
  }

  return {
    provide: {
      ufetch<T> (resource: string, options?: UfetchOptions) {
        const {
          onResponse = () => {},
          disableInterceptors = false,
          ...otherOptions
        } = options || {};

        // const headers = Object.assign(useRequestHeaders(['cookie']));

        return $fetch<T>(resource, {
          credentials: 'include',
        //   headers,
          retry: 0,
          onResponse: (args) => {
            if (!disableInterceptors) interceptorsUFetch(args);
            onResponse(args);
          },
          onResponseError: (args) => {
            if (!disableInterceptors) interceptorsUFetch(args);
            // keep original behavior: do not swallow the error; $fetch will rethrow after hooks
          },
          ...otherOptions,
        });
      },
    },
  };
});
