import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
export default defineConfig([
  globalIgnores(['.next/**', '.next-dev/**', 'next-env.d.ts', 'test-results/**', 'data/**', 'public/maplibre-gl-*.mjs']),
  js.configs.recommended,
  tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['**/*.{tsx,ts}'], plugins: { 'react-hooks': hooks }, rules: {
    ...hooks.configs.recommended.rules,
    'react-hooks/exhaustive-deps': 'error'
  } }
]);
