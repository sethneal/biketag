import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      sourceType: "module",
    },
    rules: {
      "no-undef": "off",
    },
  },
];
