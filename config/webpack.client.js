/* eslint no-console: 0 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const root = path.resolve(__dirname, '..');
const packageJson = require('../package.json');
const dllConfig = packageJson.dllPlugin;
const compact = array => array.filter(Boolean);

const outputPath = path.resolve(root, 'dist-client');
const publicPath = '/';

module.exports = (env, argv) => {
  const isProduction = argv.mode == 'production';

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
    stats: isProduction ? 'normal' : 'errors-only',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: {
      app: isProduction
        ? ['./app/index.js']
        : [
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
      pathinfo: false,
      sourceMapFilename: '[file].map'
    },

    plugins: compact([
      // Explicitly import the moment locales we care about:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isProduction && new DuplicatePackageCheckerPlugin(),
      new webpack.IgnorePlugin(/^jsdom$/),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].chunk.[contenthash].css'
        }),
      !isProduction &&
        new webpack.DllReferencePlugin({
          context: root,
          manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        }),

      isProduction && new OptimizeCSSAssetsPlugin({}),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        __CLIENT__: true
      }),
      process.env.BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
      !isProduction && new webpack.HotModuleReplacementPlugin(),

      new StatsWriterPlugin({
        filename: 'stats.json',
        fields: ['assets'],
        transform: JSON.stringify
      }),
      new FilterWarningsPlugin({
        // suppress conflicting order warnings from mini-css-extract-plugin.
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        exclude: /Conflicting order between:/
      }),

      new AssetsPlugin({
        path: outputPath
      })
    ]),
    resolve: {
      modules: [root, 'node_modules'],
      alias: {
        // react-hot-loader imports merge like this "require('lodash/merge')"
        // Aka. doesn't support our lodash-es alias by default
        'lodash/merge': 'node_modules/lodash/merge.js',
        lodash: 'node_modules/lodash-es',
        'moment-timezone':
          'moment-timezone/builds/moment-timezone-with-data-2012-2022.min',
        immutable: 'node_modules/immutable'
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [path.resolve(root, 'app'), path.resolve(root, 'config')]
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
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
                  localIdentName: '[name]__[local]--[hash:base64:10]'
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
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
                    }
                  }),
                  require('postcss-preset-env')({
                    stage: 1,
                    features: {
                      'custom-media-queries': true
                    }
                  }),
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
          test: /manifest\.json/,
          loader: 'file-loader',
          type: 'javascript/auto',
          options: {
            name: '[name].[ext]'
          }
        },
        {
          test: /((opensearch\.xml|favicon\.png)$|icon-)/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    }
  };
};
module.exports.outputPath = outputPath;
module.exports.publicPath = publicPath;
