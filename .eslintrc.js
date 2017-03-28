module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		mocha: true
	},
	extends: 'eslint:recommended',
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: true
	},
	rules: {
		// 'comma-dangle': ['error', 'always-multiline'], // 末尾必须是逗号
		'indent': ['error', 'tab'], //缩进
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'no-unused-vars': ['warn'],
		'no-console': 0,
	}
};