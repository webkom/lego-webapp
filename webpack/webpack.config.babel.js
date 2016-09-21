const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('../package.json');

const compact = (array) => array.filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: !isProduction && 'eval-source-map',
  entry: {
    app: compact([
      !isProduction && 'webpack-hot-middleware/client',
      !isProduction && 'react-hot-loader/patch',
      './app/index.js'
    ])
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  plugins: compact([
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProduction),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
      minimize: true,
      debug: false
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
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [{
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
      test: /\.(png|jpg|mp4|webm)/,
      loader: 'url',
      query: {
        limit: 8192
      }
    }]
  },

  postcss(wp) {
    return [
      require('postcss-import')({ addDependencyTo: wp }),
      require('postcss-cssnext'),
      require('postcss-nested')
    ];
  }
}
