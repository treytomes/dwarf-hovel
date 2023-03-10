const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin"); // Required to make Jimp work in a browser.

module.exports = {
	entry: {
		index: './src/index.ts'
	},
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	devtool: 'inline-source-map',
	devServer: {
		static: './dist'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Dwarf Hovel'
		}),
		new NodePolyfillPlugin() // Required to make Jimp work in a browser.
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.(csv|tsv)$/i,
				use : [ 'csv-loader' ]
			},
			{
				test: /\.xml$/i,
				use: [ 'xml-loader' ]
			},
			{
				test: /\.(txt|fs|vs)$/i,
				use: [ 'text-loader' ]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: '/node_modules/'
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		fallback: {
			fs: false,  // Required to make Jimp work in a browser.
		}
	}
};
