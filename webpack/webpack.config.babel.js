const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('../package.json');

const root = path.resolve(__dirname, '..');
const dllConfig = packageJson.dllPlugin;
const compact = (array) => array.filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  cache: true,
  devtool: !isProduction && 'cheap-module-eval-source-map',
  entry: {
    app: compact([
      !isProduction && 'webpack-hot-middleware/client',
      !isProduction && 'react-hot-loader/patch',
      './app/index.js'
    ]),
    vendor: ['react', 'react-dom', 'react-router', 'moment', 'moment-timezone']
  },

  output: {
    path: path.join(root, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },

  plugins: getDependencyHandlers().concat(compact([
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProduction),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL) || JSON.stringify('http://127.0.0.1:8000/api/v1'),
      'process.env.WS_URL': JSON.stringify(process.env.WS_URL) || JSON.stringify('ws://127.0.0.1:8000'),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL) || JSON.stringify('http://127.0.0.1:8000'),
      'process.env.CAPTCHA_KEY': JSON.stringify(process.env.CAPTCHA_KEY)
    }),

    !isProduction && new webpack.HotModuleReplacementPlugin(),
    !isProduction && new webpack.NoEmitOnErrorsPlugin(),

    // Only include the Norwegian moment locale:
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /nb-NO/),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        minimize: isProduction,
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

    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: true,
      hash: true,
      favicon: 'app/assets/favicon.png',
      appName: packageJson.name,
      dllScriptTag: getDllScriptTag()
    })
  ])),

  resolve: {
    modules: [
      root,
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: path.resolve(root, 'app'),
      query: {
        cacheDirectory: true
      }
    }, {
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader']
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: [
        'style-loader', {
          loader: 'css-loader',
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        'postcss-loader'
      ]
    }, {
      test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|mp4|webm)/,
      loader: 'url-loader',
      query: {
        limit: 8192
      }
    }]
  }
};

function getDllScriptTag() {
  if (isProduction) {
    return '';
  }

  return '<script type="text/javascript" src="/vendors.dll.js"></script>';
}


function getDependencyHandlers() {
  if (isProduction) {
    return [new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].js'
    })];
  }

  const dllPath = path.resolve(root, dllConfig.path);
  const manifestPath = path.resolve(dllPath, 'vendors.json');

  if (!fs.existsSync(manifestPath)) {
    console.error('The DLL manifest is missing. Please run `yarn run build:dll`');
    process.exit(0);
  }

  return [
    new webpack.DllReferencePlugin({
      context: root,
      manifest: require(manifestPath)
    })
  ];
}
