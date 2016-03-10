/* eslint-disable */
var path = require('path');
module.exports = {
  output: {
    path: __dirname + '/../public',
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve: {
    alias: {
      '🏠': path.resolve(__dirname, '../src')
    },
    extensions: ['', '.js', '.jsx', '.json', '.css', '.png']
  },
  module: {
    loaders: [
      { include: /\.json$/, loaders: ['json-loader'] },
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css!postcss' },
      { test: /\.png$/, loader: 'url-loader?mimetype=image/png' }
    ]
  },
  postcss: function(webpack) {
    return [
      require('postcss-import')({ addDependencyTo: webpack }),
      require('postcss-cssnext'),
      require('postcss-nested')
    ];
  }
};
