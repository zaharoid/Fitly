
export function useUri () {
//   const config = useRuntimeConfig();
//   const urlBase = config.public.apiBase;
//   const urlServices = config.public.urlServices;

//   const isProxy = config.public.nodeEnv === 'development';
  // /p-api/ - is an api for proxy requests.
  // To avoid conflict with our created requusts from /server/api/ folder
//   const mayProxiedUrl = isProxy ? '/p-api' : urlBase;

//   const getUrlService = (subdomain: string, afterStr = '') => {
//     const fullSubdomain = subdomain ? `${subdomain}.` : '';
//     return utilFragmentedString(urlServices, { subdomain: fullSubdomain }) + afterStr;
//   };

  return {
    references: {
      countries: () => 'api/countries'
    },
    // auth: {
    //   login: () => getUrlService(apiServs.AUTH, '/login'),
    //   login2Fa: () => getUrlService(apiServs.AUTH, '/login2fa'),
    //   logout: () => getUrlService(apiServs.AUTH, '/logout'),
    //   signup: {
    //     checkEmail: () => getUrlService(apiServs.AUTH, '/register/check-email'),
    //     checkEmailCode: () => getUrlService(apiServs.AUTH, '/register/check-code'),
    //     checkPhone: () => getUrlService(apiServs.AUTH, '/register/check-phone'),
    //     checkSms: () => getUrlService(apiServs.AUTH, '/register/check-sms'),
    //     final: () => getUrlService(apiServs.AUTH, '/register'),
    //   },
    //   signRecovery: {
    //     checkEmail: () => getUrlService(apiServs.AUTH, '/recovery/check-email'),
    //     checkEmailCode: () => getUrlService(apiServs.AUTH, '/recovery/check-code'),
    //     checkPhone: () => getUrlService(apiServs.AUTH, '/recovery/check-phone'),
    //     checkSms: () => getUrlService(apiServs.AUTH, '/recovery/check-sms'),
    //     final: () => getUrlService(apiServs.AUTH, '/recovery'),
    //   },
    //   spc: {
    //     otpSend: () => getUrlService(apiServs.AUTH, '/spc/otp'),
    //     createPin: () => getUrlService(apiServs.AUTH, '/spc/add-pin'),
    //     changePin: () => getUrlService(apiServs.AUTH, '/spc/change-pin'),
    //     changePass: () => getUrlService(apiServs.AUTH, '/spc/change-pass'),
    //     restorePin: () => getUrlService(apiServs.AUTH, '/spc/restore'),
    //   },
    // },
  };
}
