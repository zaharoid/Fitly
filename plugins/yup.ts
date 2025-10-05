import * as Yup from 'yup';

export default defineNuxtPlugin((nuxtApp) => {

  Yup.setLocale({
    string: {
      email: () => 'Incorrect format of email',
    },
    mixed: {
      required: ({ path }) => `${path} is required`,
    },
  });

  Yup.addMethod(Yup.string, 'noSpecialSymbols', function (errorMessage) {
    return this.matches(/^[^!@#$%^&*(),.?":{}|<>_]*$/, ({ path }) => (
      errorMessage || `Special symbols are forbidden for ${ path }`
    ));
  });

  Yup.addMethod(Yup.string, 'paymentDetails', function (errorMessage) {
    return this
      .max(35, 'Please make Details not longer than 35 symbols')
      .matches(/^(|[A-Za-z0-9 .,"'()\-+/?:!&=]+)$/, ({ value }) => (
        errorMessage(value) || 'You have entered unsupported symbols.'
      ));
  });

  Yup.addMethod(Yup.string, 'numberMaskAmount', function (errorMessage, transactionType?: string) {
    return this.test(
      'numberMaskNotNull',
      ({ path }) => errorMessage || `${path} should not be 0`,
      val => Boolean(utilNumberFromMask(val || '')),
    ).test(
      'numberMaskPositive',
      ({ path }) => errorMessage || `${path} should not be positive number`,
      val => (utilNumberFromMask(val || '') || 0) > 0,
    ).test(
      'amountMax',
      ({ path }) => errorMessage || `${path} is too big`,
      (val) => {
        if (transactionType === 'interac') {
          return (utilNumberFromMask(val || '') || 0) < 10001;
        }
        return (utilNumberFromMask(val || '') || 0) < 1000000000000;
      },
    );
  });

  Yup.addMethod(Yup.string, 'noNumber', function (errorMessage) {
    return this.matches(/^\D*$/, ({ path }) => (
      errorMessage || `${path} should not contain number`
    ));
  });

  Yup.addMethod(Yup.string, 'ownNameSpace', function (errorMessage) {
    return this.trim().matches(/^(\S+\s?\S+)?$/, ({ path }: { path: string }) => (
      errorMessage || `${path} should have max 2 words with only one space between them`
    ));
  });

  Yup.addMethod(Yup.string, 'latinNamePattern', function (errorMessage) {
    return this.trim().matches(/^[a-zA-Z -]+$/, () => (
      errorMessage || 'Please use only Latin letters, spaces, and hyphens.'
    ));
  });
  Yup.addMethod(Yup.string, 'nonCyrillic', function (errorMessage) {
    return this.test(
      'non-cyrillic',
      errorMessage || 'Please use only English letters, spaces, and basic punctuation.',
      (value) => {
        if (!value) return true;
        return /^[A-Za-z0-9 .,'"“”‘’=+-{}\-/_()!&?;:\n\r]*$/.test(value);
      },
    );
  });

  Yup.addMethod(Yup.string, 'ownName', function (errorMessage) {
    return this.max(30)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .noSpecialSymbols(errorMessage)
      .noNumber(errorMessage)
      .ownNameSpace(errorMessage)
      .latinNamePattern(errorMessage);
  });

  Yup.addMethod(Yup.string, 'iban', function (required = true) {
    return required
      ? this.min(6).max(34, 'Please make IBAN not longer than 34 symbols')
      : this;
  });
});
