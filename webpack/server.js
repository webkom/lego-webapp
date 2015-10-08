/* eslint no-var: 0 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dev.config');
var port = process.env.WEBPACK_PORT || 3000;

var server = new WebpackDevServer(webpack(config), {
  contentBase: 'public/',
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
});

server.listen(port, 'localhost', function listen(err) {
  if (err) return console.log(err);
  console.log('Listening to port:', port);
});
