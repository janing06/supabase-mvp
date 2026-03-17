import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['**/.gitkeep'], // ✅ Ignore .gitkeep files properly
  },
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
])
