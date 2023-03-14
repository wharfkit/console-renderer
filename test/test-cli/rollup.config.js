import typescript from '@rollup/plugin-typescript'

/** @type {import('rollup').RollupOptions} */
export default [
    {
        input: './test/test-cli/runTest.ts',
        output: {
            file: 'test/test-cli/lib/runTest.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        plugins: [typescript({target: 'es6', tsconfig: 'tsconfig.json'})],
    },
]
