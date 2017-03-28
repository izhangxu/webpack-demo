const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 去除无用的css
const PurifyCSSPlugin = require('purifycss-webpack');
// css 校验
const StyleLintPlugin = require('stylelint-webpack-plugin');
// 图片压缩
const ImageminPlugin = require('imagemin-webpack-plugin').default;
// 生成雪碧图
const SpritesmithPlugin = require('webpack-spritesmith');
// 清空文件目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 压缩js
const BabiliPlugin = require('babili-webpack-plugin');
// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
// 
const HtmlWebpackPlugin = require('html-webpack-plugin');


const webpack = require('webpack');

// 多页配置
exports.page = ({
	path = '',
	template = require.resolve(
		'html-webpack-plugin/default_index.ejs'
	),
	title,
	entry,
	chunks
} = {}) => ({
	entry,
	plugins: [
		new HtmlWebpackPlugin({
			filename: `${path && path + '/'}index.html`,
			template,
			title,
			chunks
		}),
	],
});



exports.dontParse = ({
	name,
	path
}) => {
	const alias = {};
	alias[name] = path;

	return {
		module: {
			noParse: [
				new RegExp(path),
			],
		},
		resolve: {
			alias,
		},
	};
};
// 切换环境变量
exports.setFreeVariable = (key, value) => {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [
			new webpack.DefinePlugin(env),
		],
	};
};

// 压缩css
exports.minifyCSS = ({
	options
}) => ({
	plugins: [
		new OptimizeCSSAssetsPlugin({
			cssProcessor: cssnano,
			cssProcessorOptions: options,
			canPrint: false,
		}),
	],
});

// 压缩js
exports.minifyJavaScript = () => ({
	plugins: [
		new BabiliPlugin(),
	],
});

// 添加头部注释
exports.attachComment = () => ({
	plugins: [
		new webpack.BannerPlugin({
			banner: new Date().toLocaleString(),
		}),
	],
});

exports.clean = (path) => ({
	plugins: [
		new CleanWebpackPlugin([path]),
	],
});

// 
exports.extractBundles = (bundles) => ({
	plugins: bundles.map((bundle) => (
		new webpack.optimize.CommonsChunkPlugin(bundle)
	)),
});

// 生成source.map文件的规则
exports.generateSourceMaps = ({
	type
}) => ({
	devtool: type,
});


// 加载js
exports.loadJavaScript = ({
	include,
	exclude
}) => ({
	module: {
		rules: [{
			test: /\.js$/,
			include,
			exclude,

			loader: 'happypack/loader',
			options: {
				// Enable caching for improved performance during
				// development.
				// It uses default OS directory by default. If you need
				// something more custom, pass a path to it.
				// I.e., { cacheDirectory: '<path>' }
				cacheDirectory: true,
			},
		}, ],
	},
});

// font 
exports.loadFonts = ({
	include,
	exclude,
	options
} = {}) => ({
	module: {
		rules: [{
			// Capture eot, ttf, woff, and woff2
			test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
			include,
			exclude,

			use: {
				loader: 'file-loader',
				options,
			},
		}, ],
	},
});
// 雪碧图
exports.spritesmithImages = (
	options
) => ({
	plugins: [
		new SpritesmithPlugin(options)
	]
});

// 压缩图片
exports.imageminImages = ({
	options
}) => ({
	plugins: [
		new ImageminPlugin({
			options
		})
	]
});

// 集成图片
exports.loadImages = ({
	include,
	exclude,
	options
} = {}) => ({
	module: {
		rules: [{
			test: /\.(png|jpg|svg)$/,
			include,
			exclude,

			use: {
				loader: 'url-loader',
				options
			}
		}]
	}
});

// 检测css
exports.lintCSS = ({
	files,
	context
}) => ({
	plugins: [
		new StyleLintPlugin({
			files,
			context,
			configFile: './.stylelintrc.js'
		}),
	]
});


//去除没用的css
exports.purifyCSS = ({
	paths
}) => ({
	plugins: [
		new PurifyCSSPlugin({
			paths,
		})
	]
});

/*增加css3兼容，自动补全前缀*/
exports.autoprefix = () => ({
	loader: 'postcss-loader',
	options: {
		plugins: () => ([
			require('autoprefixer')
		]),
	},
});
// 热更新
exports.devServer = ({
	host,
	port
} = {}) => ({
	devServer: {
		historyApiFallback: true,
		stats: 'errors-only',
		host, // Defaults to `localhost`
		port, // Defaults to 8080
		overlay: {
			errors: true,
			warnings: true,
		},
	},
});

//js代码检测
exports.lintJavaScript = ({
	include,
	exclude,
	options
}) => ({
	module: {
		rules: [{
			test: /\.js$/,
			include,
			exclude,
			enforce: 'pre',

			loader: 'eslint-loader',
			options,
		}, ],
	},
});

exports.loadCSS = ({
	include,
	exclude
} = {}) => ({
	module: {
		rules: [{
			test: /\.css$/,
			include,
			exclude,

			use: ['style-loader', 'css-loader']
		}]
	}
});
// 提取css
exports.extractCSS = ({
	include,
	exclude,
	use
}) => {
	const plugin = new ExtractTextPlugin({
		filename: '[name].[contenthash:8].css'
	});
	return {
		module: {
			rules: [{
				test: /\.css$/,
				include,
				exclude,

				use: plugin.extract({
					use,
					fallback: 'style-loader'
				})
			}]
		},
		plugins: [plugin]
	};
};