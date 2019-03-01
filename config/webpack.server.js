const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const root = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    target: 'node',
    stats: { children: false },
    entry: {
      server: [
        !isProduction && 'webpack/hot/poll?1000',
        path.resolve(__dirname, '..', 'server/index.js')
      ].filter(Boolean)
    },
    optimization: {
      minimize: false
    },
    externals: [
      nodeExternals({ whitelist: ['webpack/hot/poll?1000', /css$/] })
    ],

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
      !isProduction &&
        new StartServerPlugin({ name: 'server.js', signal: true }),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __DEV__: JSON.stringify(!isProduction)
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
      extensions: ['.js', '.jsx', '.json']
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
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: isProduction
                  ? '[hash:base64:5]'
                  : '[name]__[local]___[hash:base64:5]'
              }
            },
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
          options: {
            limit: 8192,
            emitFile: false
          }
        },
        {
          test: /manifest\.json/,
          loader: 'file-loader?name=[name].[ext]',
          type: 'javascript/auto',
          options: {
            emitFile: false
          }
        },
        {
          test: /((opensearch\.xml|favicon\.png)$|icon-)/,
          loader: 'file-loader?name=[name].[ext]',
          options: {
            emitFile: false
          }
        }
      ]
    }
  };
};
