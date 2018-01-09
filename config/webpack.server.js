const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const StartServerPlugin = require('start-server-webpack-plugin');
const root = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    server: [
      !isProduction && 'webpack/hot/poll?1000',
      path.resolve(__dirname, '..', 'server/index.js')
    ].filter(Boolean)
  },

  output: {
    path: path.join(root, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[file].map'
  },

  devtool: 'source-map',

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs
    .readdirSync(path.resolve('node_modules'))
    .concat(['react-dom/server', 'react/addons'])
    .reduce((ext, mod) => {
      ext[mod] = `commonjs ${mod}`;
      return ext;
    }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  plugins: [
    !isProduction && new StartServerPlugin('server.js'),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    })
  ].filter(Boolean),

  resolve: {
    modules: [root, 'node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['css-loader/locals']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'css-loader/locals',
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
        test: /\.(png|jpg|jpeg|gif|svg|bdf|woff|woff2|ttf|mp3|mp4|webm)$/,
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
