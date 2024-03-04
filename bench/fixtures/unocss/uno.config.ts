import { defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import presetUno from '@unocss/preset-uno'
export default defineConfig({
  mergeSelectors: false,
  content: {
    pipeline: {
      include: [/\.js$/]
    }
  },
  presets: [presetUno()],
  transformers: [transformerDirectives()]
})
