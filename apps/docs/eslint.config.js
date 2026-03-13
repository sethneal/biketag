import nuxtConfig from "eslint-config-custom/nuxt";

export default [
  { ignores: ["node_modules/", "dist/", ".nuxt/"] },
  ...nuxtConfig,
];
