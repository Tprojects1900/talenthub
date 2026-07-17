const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const buildVersion = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    entry: './src/main.jsx',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        publicPath: '/',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        mainFields: ['browser', 'module', 'main'],
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        ios: "9",
                                        safari: "9",
                                    },
                                    useBuiltIns: "usage",
                                    corejs: 3,
                                },
                            ],
                            [
                                '@babel/preset-react',
                                {
                                    runtime: 'automatic',
                                },
                            ],
                        ],
                    },
                },
            },

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext][query]',
                },
            },
        ],
    },

    optimization: {
        minimize: true,

        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    safari10: true,
                    compress: {
                        ecma: 5,
                    },
                    output: {
                        ecma: 5,
                    },
                },
            }),
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
             templateParameters: {
        buildVersion,
    },
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '.',
                },
            ],
        }),
    ],

    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 3000,
    },
};