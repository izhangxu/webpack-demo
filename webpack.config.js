const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const glob = require('glob');
const webpack = require('webpack');
const HappyPack = require('happypack'); //多路

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build'),
	style: glob.sync('./app/**/*.css')
};

const commonConfig = merge(
	[{
			entry: {
				app: PATHS.app,
				vendor: ['react']
			},
			output: {
				path: PATHS.build,
				filename: '[name].js',
			},
			plugins: [
				new HtmlWebpackPlugin({
					title: 'Webpack demo',
				}),
				new HappyPack({
					loaders: [
						// Capture Babel loader
						'babel-loader'
					],
				}),
			],
		},
		parts.lintJavaScript({
			include: PATHS.app
		}),
		parts.lintCSS({
			files: '**/*.css',
			context: `${PATHS.app}`,
			ignoreFiles: 'node_modules/**/*.css'
		}),
		parts.loadFonts({
			options: {
				name: '[name].[hash:8].[ext]',
			},
		}),
		parts.loadJavaScript({
			include: PATHS.app
		}),
		parts.extractBundles(
			[{
				name: 'vendor'
			}, {
				name: 'manifest',
				minChunks: Infinity
			}]),
	]);

const productionConfig = merge(
	[{
			performance: {
				hints: 'warning', // 'error' or false are valid too
				maxEntrypointSize: 100000, // in bytes
				maxAssetSize: 450000, // in bytes
			},
			output: {
				chunkFilename: '[name].[chunkhash:8].js',
				filename: '[name].[chunkhash:8].js'
			},
			plugins: [
				new webpack.HashedModuleIdsPlugin(),
			],
			recordsPath: `${PATHS.build}/records.json`,

		},

		parts.clean(PATHS.build),

		// parts.minifyJavaScript(),
		// parts.minifyCSS({
		// 	options: {
		// 		discardComments: {
		// 			removeAll: true,
		// 		},
		// 		// Run cssnano in safe mode to avoid
		// 		// potentially unsafe transformations.
		// 		safe: true,
		// 	},
		// }),
		parts.attachComment(),

		parts.extractCSS({
			use: [
				'css-loader', parts.autoprefix()
			]
		}),
		parts.purifyCSS({
			paths: glob.sync(`${PATHS.app}/**/*`, {
				nodir: true
			})
		}),
		parts.loadImages({
			options: {
				limit: 15000,
				name: '[name][hash:8].[ext]',
			}
		}),
		parts.generateSourceMaps({
			type: 'source-map'
		}),
		// parts.spritesmithImages({
		// 	src: {
		// 		cwd: `${PATHS.app}/ico`,
		// 		glob: '*.png'
		// 	},
		// 	target: {
		// 		image: `${PATHS.app}/spritesmith-generated/sprite.png`,
		// 		css: `${PATHS.app}/spritesmith-generated/sprite.styl`
		// 	},
		// 	apiOptions: {
		// 		cssImageRef: "../spritesmith-generated/sprite.png"
		// 	}
		// })
		parts.setFreeVariable('process.env.NODE_ENV', 'production'),
	]);

const developmentConfig = merge(
	[{
			output: {
				devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
			}
		},
		parts.generateSourceMaps({
			type: 'cheap-module-eval-source-map'
		}),
		parts.devServer({
			historyApiFallback: true,
			hot: true,
			stats: 'errors-only',
			// Customize host/port here if needed
			host: process.env.HOST,
			port: process.env.PORT,
			overlay: {
				errors: true,
				warnings: true,
			},
		}),
		parts.loadCSS(),
		parts.loadImages(),
		parts.dontParse({
			name: 'react',
			path: path.resolve(__dirname, 'node_modules/react/dist/react.min.js'),
		}),
	]);

module.exports = (env) => {
	if (env === 'production') {
		return merge(commonConfig, productionConfig);
	}

	return merge(commonConfig, developmentConfig);
};