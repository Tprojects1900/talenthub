const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/', // 🚀 AJOUTE CETTE LIGNE ICI
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // Nettoyé : On supprime l'alias Apollo qui brisait les sous-chemins /link/context et /link/subscriptions
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!apollo-upload-client)/, 
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: "ios >= 11, safari >= 11, defaults, not ie 11"
              }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
      // AJOUT ICI : Gestion des images pour éviter l'erreur "Unexpected character"
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true,
          compress: { ecma: 5 },
          output: { ecma: 5 }
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },
};