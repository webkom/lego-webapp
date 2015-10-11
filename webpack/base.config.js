/* eslint no-var: 0 */
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
      { test: /\.css$/, loader: 'style!css!cssnext' },
      { test: /\.png$/, loader: 'url-loader?mimetype=image/png' }
    ]
  },
  cssnext: {
    plugins: [
      require('postcss-nested')
    ]
  }
};
