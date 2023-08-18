import typescript from '@rollup/plugin-typescript'

export default [{
  input: ['./src/index.ts'],
  output: {
    format: 'es',
    dir: 'exports'
  },
  external: [
    "net", "events"
  ],
  plugins: [
    typescript()
  ]
}]