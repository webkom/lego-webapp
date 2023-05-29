/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const root = path.resolve(__dirname, '..');
const packageJson = require('../package.json');

const dllConfig = packageJson.dllPlugin;
const compact = (array) => array.filter(Boolean);

const outputPath = path.resolve(root, 'dist-client');
const publicPath = '/';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const dllPath = path.resolve(root, dllConfig.path);
  const manifestPath = path.resolve(dllPath, 'vendors.json');

  if (!isProduction && !fs.existsSync(manifestPath)) {
    console.error(
      'The DLL manifest is missing. Please run `yarn run build:dll`'
    );
    process.exit(1);
  }

  return {
    mode: argv.mode,
    stats: isProduction
      ? 'normal'
      : {
          all: false,
          modules: false,
          errors: true,
          warnings: true,
          moduleTrace: true,
          errorDetails: true,
        },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: {
      app: isProduction
        ? ['./app/index.ts']
        : ['webpack-hot-middleware/client', './app/index.ts'],
    },

    output: {
      path: outputPath,
      filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
      chunkFilename: isProduction
        ? '[name].chunk.[chunkhash:8].js'
        : '[name].chunk.js',
      publicPath,
      pathinfo: false,
      sourceMapFilename: '[file].map',
    },

    plugins: compact([
      // Explicitly import the moment locales we care about:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      isProduction && new DuplicatePackageCheckerPlugin(),
      new webpack.IgnorePlugin({ resourceRegExp: /^jsdom$/ }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].chunk.[contenthash].css',
        }),
      !isProduction &&
        new webpack.DllReferencePlugin({
          context: root,
          manifest: manifestPath,
        }),

      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        __CLIENT__: true,
      }),
      process.env.BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      !isProduction && new ReactRefreshWebpackPlugin(),

      new StatsWriterPlugin({
        filename: 'stats.json',
        fields: ['assets'],
        transform: JSON.stringify,
      }),
      new FilterWarningsPlugin({
        // suppress conflicting order warnings from mini-css-extract-plugin.
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        exclude: /Conflicting order. Following module has been added/,
      }),

      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),

      isProduction && new LoadablePlugin(),

      isProduction && new CompressionPlugin(),

      !isProduction &&
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),

      new AssetsPlugin({
        path: outputPath,
      }),
    ]),
    resolve: {
      modules: [root, 'node_modules'],
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        // react-hot-loader imports merge like this "require('lodash/merge')"
        // Aka. doesn't support our lodash-es alias by default
        'lodash/merge': 'node_modules/lodash/merge.js',
        'lodash/fp': 'node_modules/lodash/fp',
        lodash: 'node_modules/lodash-es',
        'moment-timezone':
          'moment-timezone/builds/moment-timezone-with-data-10-year-range.min',
      },
      fallback: {
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        isProduction && new TerserPlugin(),
      ].filter(Boolean),
    },

    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          include: [path.resolve(root, 'app'), path.resolve(root, 'config')],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  !isProduction && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]--[contenthash:base64:10]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-import')({
                      path: [root],
                      // postcss doesn't support webpack modules import, which css-loader
                      // requires that we use, so we need to resolve imports with '~'
                      // manually.
                      resolve(id, basedir) {
                        if (/^~app/.test(id)) {
                          return path.resolve(root, id.slice(1));
                        }
                        if (/^~/.test(id)) {
                          return path.resolve('./node_modules', id);
                        }
                        return path.resolve(basedir, id);
                      },
                    }),
                    require('postcss-preset-env')({
                      stage: 1,
                      features: {
                        'custom-media-queries': true,
                      },
                    }),
                    require('postcss-nested'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bdf|eot|woff|woff2|ttf|mp3|mp4|webm)$/,
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
module.exports.outputPath = outputPath;
module.exports.publicPath = publicPath;
