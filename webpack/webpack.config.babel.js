const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('../package.json');

const compact = (array) => array.filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: !isProduction && 'eval',
  entry: {
    app: compact([
      !isProduction && 'webpack-hot-middleware/client',
      !isProduction && 'react-hot-loader/patch',
      './app/index.js'
    ]),
    vendor: ['react', 'react-dom', 'lodash', 'react-router']
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  plugins: compact([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js'
    }),

    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProduction),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL) || JSON.stringify('http://127.0.0.1:8000/api/v1'),
      'process.env.WS_URL': JSON.stringify(process.env.WS_URL) || JSON.stringify('http://127.0.0.1:8000'),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL) || JSON.stringify('http://127.0.0.1:8000'),
    }),

    !isProduction && new webpack.HotModuleReplacementPlugin(),
    !isProduction && new webpack.NoErrorsPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        minimize: isProduction,
        postcss(wp) {
          return [
            require('postcss-import')({ addDependencyTo: wp }),
            require('postcss-cssnext'),
            require('postcss-nested')
          ];
        }
      }
    }),

    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: true,
      hash: true,
      favicon: 'app/assets/favicon.png',
      appName: packageJson.name
    })
  ]),

  resolve: {
    modules: [
      path.resolve(__dirname, '../'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.join(__dirname, '../app')
    }, {
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style', 'css']
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: [
        'style', {
          loader: 'css',
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        'postcss'
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|mp4|webm)/,
      loader: 'url',
      query: {
        limit: 8192
      }
    }]
  }
};
