module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        // 'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 'vue/multi-word-component-names': [
        //     //关闭vue组件不容许index.vue命名的校验
        //     'error',
        //     {
        //         ignores: ['index'], //需要忽略的组件名
        //     },
        // ],
        //完全关闭组件名校验
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
    },
}
