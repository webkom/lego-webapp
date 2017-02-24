const fs = require('fs');
const path = require('path');
const { LoaderOptionsPlugin, DefinePlugin } = require('webpack');

const root = path.resolve(__dirname, '..');

module.exports = {

  entry: {
    server: path.resolve(__dirname, 'server.js')
  },

  output: {
    path: path.join(root, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve('node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce((ext, mod) => {
    ext[mod] = `commonjs ${mod}`;
    return ext;
  }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  plugins: [
    new DefinePlugin({
      __CLIENT__: false,
      __DEV__: true
    }),
    new LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss() {
          return [
            require('postcss-import')({
              path: [root]
            }),
            require('postcss-cssnext'),
            require('postcss-nested')
          ];
        }
      }
    }),
  ],

  resolve: {
    modules: [
      root,
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['null-loader']
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'null-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|mp4|webm)/,
        loader: 'url-loader',
        query: {
          limit: 8192
        }
      }
    ]
  },
};
