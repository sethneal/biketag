import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
  ...pluginVue.configs["flat/essential"],
  ...tseslint.configs.recommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
