/* eslint no-var: 0 */
var objectAssign = require('object-assign');
var webpack = require('webpack');
var baseConfig = require('./base.config');

module.exports = objectAssign(baseConfig, {
  entry: './src/index.js',
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false
    })
  ]
});
