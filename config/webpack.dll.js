const path = require('path');
const pullAll = require('lodash/pullAll');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');
const packageJson = require(path.join(root, 'package.json'));

const dllConfig = packageJson.dllPlugin;
const outputPath = path.join(root, dllConfig.path);

const vendors = Object.keys(packageJson.dependencies);

module.exports = () => ({
  context: root,
  mode: 'development',
  entry: {
    vendors: pullAll(vendors, dllConfig.exclude),
  },
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(outputPath, '[name].json'),
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      vm: require.resolve('vm-browserify'),
      'process/browser': require.resolve('process/browser'),
    },
  },
  stats: {
    chunks: true,
  },
});
