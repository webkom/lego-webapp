/* eslint no-console: 0 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');

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
    mode: 'none',
    stats: { children: false },
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
      !isProduction &&
        new webpack.DllReferencePlugin({
          context: root,
          manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
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
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            test: 'vendor',
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
          test: /manifest\.json/,
          loader: 'file-loader?name=[name].[ext]',
          type: 'javascript/auto'
        },
        {
          test: /((opensearch\.xml|favicon\.png)$|icon-)/,
          loader: 'file-loader?name=[name].[ext]'
        }
      ]
    }
  };
};
module.exports.outputPath = outputPath;
module.exports.publicPath = publicPath;
