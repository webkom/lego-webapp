const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
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
      server: path.resolve(__dirname, '..', 'server/index.ts'),
    },
    optimization: {
      minimize: false,
    },
    externals: [
      nodeExternals({ allowlist: ['webpack/hot/poll?1000', /css$/] }),
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
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __DEV__: JSON.stringify(!isProduction),
      }),
      new FilterWarningsPlugin({
        // suppress conflicting order warnings from mini-css-extract-plugin.
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        exclude: /Conflicting order. Following module has been added/,
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].chunk.[contenthash].css',
        }),
    ].filter(Boolean),

    resolve: {
      modules: [root, 'node_modules'],
      extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
      alias: {
        lodash: 'node_modules/lodash-es',
        'moment-timezone':
          'moment-timezone/builds/moment-timezone-with-data-10-year-range.min',
      },
    },

    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
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
                    importLoaders: 1,
                    modules: {
                      localIdentName:
                        '[name]__[local]--[contenthash:base64:10]',
                      namedExport: false,
                    },
                  },
                },
              ]
            : 'null-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bdf|woff|woff2|ttf|mp3|mp4|webm)$/,
          type: 'asset',
        },
        {
          test: /manifest\.json/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /((opensearch\.xml|favicon\.png)$|icon-)/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
  };
};
