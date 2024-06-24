import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  {rules: {
    "indent": ["error", "tab"],
    "object-curly-newline": ["error", { "ImportDeclaration": "always", "ExportDeclaration": "always", "ObjectExpression": "always", "ObjectPattern": "never" }],
    "object-property-newline": "error",
    "semi": ["error", "always"]
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];