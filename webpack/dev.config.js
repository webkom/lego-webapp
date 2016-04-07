/* eslint no-var: 0 */
var objectAssign = require('object-assign');
var webpack = require('webpack');
var baseConfig = require('./base.config');

module.exports = objectAssign(baseConfig, {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/index.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ]
});
