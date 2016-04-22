/* eslint-disable */
var path = require('path');
module.exports = {
  output: {
    path: __dirname + '/../public',
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../'),
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx', '.json', '.css', '.png']
  },
  module: {
    loaders: [
      { include: /\.json$/, loaders: ['json-loader'] },
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css?modules&&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss' },
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
