const path = require('path');
const webpack = require('webpack');

const pluginConfigs = {
};

const baseConfig = {
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/dist')
	},
	stats: "errors-only",
	mode: 'production',
	module: {
		rules: [
			{
				test: [/\.js$/, /\.jsx$/, /\.graphql$/],
				exclude: [/node_modules/,/jsdom/],
				loader: "babel-loader"
			},
			{
				type: 'javascript/auto',
				test: /\.mjs$/,
				exclude: [/node_modules/],
				use: []
			}
		]
	}
};

const serverConfig = Object.assign({}, baseConfig, {
	entry: {
		index: ['@babel/polyfill', path.join(__dirname, '/index.js')]
	},
	target: 'node',
	plugins: [
	]
});

module.exports = [
	serverConfig
];

module.exports.pluginConfigs = pluginConfigs;
