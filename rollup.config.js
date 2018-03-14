import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default [
	{
        input: './src/lib/Lib.ts',
        external: ['fluture', 'sanctuary'],
        output: [
            { file: pkg.module, format: 'es', sourcemap: true },
            { file: pkg.main, format: 'cjs', sourcemap: true }
        ],
        plugins: [
            postcss({
                extensions: [ '.css' ],
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify( process.env['NODE_ENV'] )
            }),
            typescript({
                useTsconfigDeclarationDir: true
            })
        ]
	}
];