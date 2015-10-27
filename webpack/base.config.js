/* eslint-disable */
module.exports = {
  output: {
    path: __dirname + '/../public',
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.png']
  },
  module: {
    loaders: [
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
