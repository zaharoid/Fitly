module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:storybook/recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  plugins: ['vuejs-accessibility'],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 3 },
        multiline: { max: 1 },
      },
    ],
    curly: ['error', 'multi-line'],
    'vuejs-accessibility/label-has-for': [
      'error',
      {
        controlComponents: ['VField', 'OtpInput', 'TelInput', 'FileUploadApi'],
        required: {
          every: ['nesting', 'id'],
        },
        allowChildren: true,
      },
    ],
  },
};
