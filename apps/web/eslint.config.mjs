import vueConfig from "eslint-config-custom/vue";

export default [
  { ignores: ["node_modules/", "dist/"] },
  ...vueConfig,
];
