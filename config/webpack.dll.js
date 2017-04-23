const path = require('path');
const webpack = require('webpack');
const pullAll = require('lodash/pullAll');

const root = path.resolve(__dirname, '..');
const packageJson = require(path.join(root, 'package.json'));

const dllConfig = packageJson.dllPlugin;
const outputPath = path.join(root, dllConfig.path);

const vendors = Object.keys(packageJson.dependencies);

module.exports = () => ({
  context: root,
  devtool: 'eval',
  entry: {
    vendors: pullAll(vendors, dllConfig.exclude)
  },
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(outputPath, '[name].json')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
});
