const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const HappyPack = require('happypack'); //多路

const PATHS = {
	lib: path.join(__dirname, 'lib'),
	build: path.join(__dirname, 'dist')
};

const commonConfig = merge(
	[{
			entry: {
				demo: PATHS.lib
			},
			output: {
				path: PATHS.build,
				library: 'Demo',
				libraryTarget: 'umd'
			},
			plugins: [
				new HappyPack({
					loaders: [
						// Capture Babel loader
						'babel-loader'
					],
				}),
			],
		},
		parts.attachComment(),
		parts.generateSourceMaps({
			type: 'source-map'
		}),
		parts.loadJavaScript({
			include: PATHS.app
		}),
	]);

const libraryConfig = merge([
	commonConfig, {
		output: {
			filename: '[name].js',
		},
	},
]);

const libraryMinConfig = merge([
	commonConfig, {
		output: {
			filename: '[name].min.js',
		},
	},
	parts.minifyJavaScript({
		useSourceMap: true
	}),
]);

module.exports = [
	libraryConfig,
	libraryMinConfig,
];