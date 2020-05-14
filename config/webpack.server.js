const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const nodeExternals = require('webpack-node-externals');
const root = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    target: 'node',
    devtool: 'source-map',
    stats: isProduction ? 'normal' : 'errors-only',
    entry: {
      server: [
        !isProduction && 'webpack/hot/poll?1000',
        path.resolve(__dirname, '..', 'server/index.js'),
      ].filter(Boolean),
    },
    optimization: {
      minimize: false,
    },
    externals: [
      nodeExternals({ whitelist: ['webpack/hot/poll?1000', /css$/] }),
    ],

    output: {
      path: path.resolve(root, 'dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      publicPath: '/',
    },

    node: {
      __filename: true,
      __dirname: true,
    },

    plugins: [
      !isProduction && new StartServerPlugin({ name: 'server.js' }),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __DEV__: JSON.stringify(!isProduction),
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
        },
      }),
      new FilterWarningsPlugin({
        // suppress conflicting order warnings from mini-css-extract-plugin.
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        exclude: /Conflicting order between:/,
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].chunk.[contenthash].css',
        }),
    ].filter(Boolean),

    resolve: {
      modules: [root, 'node_modules'],
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        lodash: 'node_modules/lodash-es',
        'moment-timezone':
          'moment-timezone/builds/moment-timezone-with-data-2012-2022.min',
        immutable: 'node_modules/immutable',
      },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: isProduction
            ? [MiniCssExtractPlugin.loader, 'css-loader']
            : 'null-loader',
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: isProduction
            ? [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: '[name]__[local]--[hash:base64:10]',
                    },
                  },
                },
              ]
            : 'null-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bdf|woff|woff2|ttf|mp3|mp4|webm)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            emitFile: false,
          },
        },
        {
          test: /manifest\.json/,
          loader: 'file-loader',
          type: 'javascript/auto',
          options: {
            emitFile: false,
            name: '[name].[ext]',
          },
        },
        {
          test: /((opensearch\.xml|favicon\.png)$|icon-)/,
          loader: 'file-loader',
          options: {
            emitFile: false,
            name: '[name].[ext]',
          },
        },
      ],
    },
  };
};
