const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/client/index.js',
	mode: 'development',
	devtool: 'source-map', // this will make the app readable and debuggable in browser console..... showing the exact line in our assets
	stats: 'normal', // output "verbose" == everything, in the terminal building-- // minimal == Only output when errors or new compilation happen // normal == Standard output.
	output: {
		libraryTarget: 'var', // that one kind of many other to access the bundle global context of our assets js.code ex. (in index.html to handle event)
		library: 'Client', /// name it whatever we want
	},
	module: {
		rules: [
			{
				test: '/.js$/',
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/client/views/index.html',
			filename: './index.html',
		}),
		new CleanWebpackPlugin({
			// Simulate the removal of files
			dry: true,
			// Write Logs to Console
			verbose: true,
			// Automatically remove all unused webpack assets on rebuild
			cleanStaleWebpackAssets: true,
			protectWebpackAssets: false,
		}),
	],
};
