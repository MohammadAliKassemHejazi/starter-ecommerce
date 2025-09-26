import type { Linter } from 'eslint';

const config: Linter.Config = {
	rules: {
		'no-var': 'error',
		semi: 'error',
		indent: ['error', 2, { SwitchCase: 1 }],
		'no-multi-spaces': 'error',
		'space-in-parens': 'error',
		'no-multiple-empty-lines': 'error',
		'prefer-const': 'error',
	},
};

export default config;