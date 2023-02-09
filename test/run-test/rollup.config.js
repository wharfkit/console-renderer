import typescript from '@rollup/plugin-typescript'

/** @type {import('rollup').RollupOptions} */
export default [
    {
        input: './test/run-test/runTest.ts',
        output: {
            file: 'test/run-test/lib/run-test.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        plugins: [typescript({target: 'es6'})],
    },
]
