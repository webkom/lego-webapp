/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const packageJson = require('../package.json');

const root = path.resolve(__dirname, '..');
const dllConfig = packageJson.dllPlugin;
const compact = array => array.filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  cache: true,
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',

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
    path: path.join(root, 'dist'),
    filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
    chunkFilename: isProduction
      ? '[name].chunk.[chunkhash:8].js'
      : '[name].chunk.js',
    publicPath: '/',
    sourceMapFilename: '[file].map'
  },

  plugins: getDependencyHandlers().concat(
    compact([
      // Explicitly import the moment locales we care about:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        __CLIENT__: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 10000
      }),
      !isProduction && new FriendlyErrorsPlugin(),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      !isProduction && new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),

      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: true
      }),

      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          minimize: isProduction
        }
      }),

      new ExtractTextPlugin({
        filename: '[name].[contenthash:8].css',
        allChunks: true,
        disable: !isProduction
      }),

      new StatsWriterPlugin({
        filename: 'stats.json',
        fields: ['assets'],
        transform: JSON.stringify
      }),

      new AssetsPlugin({
        path: path.join(root, 'dist')
      })
    ])
  ),

  resolve: {
    modules: [root, 'node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(root, 'app'),
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: isProduction ? 'css-loader' : 'css-loader?sourceMap'
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|bdf|eot|svg|woff|woff2|ttf|mp4|webm)$/,
        loader: 'url-loader',
        query: {
          limit: 8192
        }
      },
      {
        test: /((manifest\.json|favicon\.png)$|icon-)/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  }
};

function getDependencyHandlers() {
  if (isProduction) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: '[name].[hash:8].js'
      })
    ];
  }

  const dllPath = path.resolve(root, dllConfig.path);
  const manifestPath = path.resolve(dllPath, 'vendors.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(
      'The DLL manifest is missing. Please run `yarn run build:dll`'
    );
    process.exit(0);
  }

  return [
    new webpack.DllReferencePlugin({
      context: root,
      manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    })
  ];
}
