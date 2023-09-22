module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  // plugins: ['prettier'],
  rules: {
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'vue/multi-word-component-names': 'off', // 開啟是 檔案命名必須至少為2個單詞
    // 'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'javascript.validate.enable': 0,
    // 讓v-slot可以用xxx.xxx修飾符 此專案主要是v-data-table裡用
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    // 讓template可以有多個標籤
    'vue/no-multiple-template-root': 0
  },
  overrides: [
    {
      files: [
        '**/pages/**/*.{js,ts,vue}',
        '**/layouts/**/*.{js,ts,vue}',
        '**/app.{js,ts,vue}',
        '**/error.{js,ts,vue}',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
}
