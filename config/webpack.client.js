/* eslint no-console: 0 */
const path = require('path');
const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');

const root = path.resolve(__dirname, '..');
//const dllConfig = packageJson.dllPlugin;
const compact = array => array.filter(Boolean);

const outputPath = path.resolve(root, 'dist-client');
const publicPath = '/';

module.exports = (env, argv) => {
  const isProduction = argv.mode == 'production';
  return {
    mode: 'none',
    entry: isProduction
      ? {
          app: ['./app/index.js'],
          vendor: [
            'react',
            'react-dom',
            'react-router',
            'moment',
            'moment-timezone'
          ]
        }
      : {
          app: [
            'webpack-hot-middleware/client',
            'react-hot-loader/patch',
            './app/index.js'
          ]
        },

    output: {
      path: outputPath,
      filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
      chunkFilename: isProduction
        ? '[name].chunk.[chunkhash:8].js'
        : '[name].chunk.js',
      publicPath,
      sourceMapFilename: '[file].map'
    },

    plugins: compact([
      // Explicitly import the moment locales we care about:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.IgnorePlugin(/^jsdom$/),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),

      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        __CLIENT__: true,
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      }),
      process.env.BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
      !isProduction && new webpack.HotModuleReplacementPlugin(),

      new StatsWriterPlugin({
        filename: 'stats.json',
        fields: ['assets'],
        transform: JSON.stringify
      }),

      new AssetsPlugin({
        path: path.join(root, 'dist-client')
      })
    ]),
    resolve: {
      modules: [root, 'node_modules']
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [path.resolve(root, 'app'), path.resolve(root, 'config')],
          query: {
            cacheDirectory: true
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: isProduction
                  ? '[hash:base64:5]'
                  : '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-import')({
                    path: [root]
                  }),
                  require('postcss-cssnext'),
                  require('postcss-nested')
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bdf|eot|svg|woff|woff2|ttf|mp3|mp4|webm)$/,
          loader: 'url-loader',
          query: {
            limit: 8192
          }
        },
        {
          test: /((manifest\.json|opensearch\.xml|favicon\.png)$|icon-)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    }
  };
};
