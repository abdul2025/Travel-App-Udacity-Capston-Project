const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // to minify css files
const TerserPlugin = require('terser-webpack-plugin'); // to minify js file
const HtmlWebpackPlugin = require('html-webpack-plugin'); // to minify html files
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
	entry: './src/client/index.js',
	output: {
		libraryTarget: 'var',
		library: 'Client',
		filename: 'bundle.js',
	},
	mode: 'production',
	optimization: {
		minimizer: [
			new OptimizeCssAssetsPlugin(),
			new TerserPlugin(),
			new HtmlWebpackPlugin({
				template: './src/client/views/index.html',
				filename: './index.html',
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true,
				},
			}),
		],
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
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[hash].[ext]',
							outputPath: 'imgs',
						},
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
		new MiniCssExtractPlugin({ filename: './style/[name].css' }),
		// new WorkboxPlugin.GenerateSW(),
	],
};
