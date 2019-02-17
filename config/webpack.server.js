const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const root = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    target: 'node',
    entry: {
      server: [
        !isProduction && 'webpack/hot/poll?1000',
        path.resolve(__dirname, '..', 'server/index.js')
      ].filter(Boolean)
    },
    optimization: {
      minimize: false
    },

    output: {
      path: path.resolve(root, 'dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      publicPath: '/'
    },

    node: {
      __filename: true,
      __dirname: true
    },

    plugins: [
      !isProduction && new StartServerPlugin('server.js'),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __DEV__: JSON.stringify(argv.mode !== 'production')
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ].filter(Boolean),

    resolve: {
      modules: [root, 'node_modules'],
      extensions: ['.js', '.jsx']
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-import')({
                    path: [root]
                  }),
                  require('postcss-cssnext'),
                  require('postcss-nested')
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bdf|woff|woff2|ttf|mp3|mp4|webm)$/,
          loader: 'url-loader',
          query: {
            limit: 8192
          }
        },
        {
          test: /((manifest\.json|opensearch\.xml|favicon\.png)$|icon-)/,
          loader: 'file-loader?name=[name].[ext]'
        }
      ]
    }
  };
};
