const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const debug = process.env.NODE_ENV !== 'production'

const cssLoaders = [{
  loader: 'css-loader',
  options: {
    discardComments: {
      removeAll: true
    }
  }
}]

const config = {
  entry: [
    'babel-polyfill',
    `${__dirname}/app/index.js`
  ],
  
  output: {
    path: `${__dirname}/public`,
    filename: debug ? 'bundle.js' : 'bundle.[hash].js'
  },

  devtool: debug ? 'source-map' : false,

  performance: {
    hints: debug ? false : 'warning'
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.css$/,
      use: debug ? [
        'style-loader'
      ].concat(cssLoaders) : ExtractTextWebpackPlugin.extract({
        fallback: 'style-loader',
        use: cssLoaders
      })
    }, {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      use: 'file-loader'
    }, {
      test: /\.(jpg|png|svg)$/,
      use: {
        loader: 'url-loader',
        query: {
          limit: 15 * 1000
        }
      }
    }]
  },

  devServer: {
    contentBase: `${__dirname}/public`,
    port: 3000
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: !debug,
      debug
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new HtmlWebpackPlugin({
      inject: 'body',
      template: `${__dirname}/index.html`
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: debug
    })
  ]
}

if (!debug) {
  const prodPlugins = [
    new ExtractTextWebpackPlugin('layout.[contenthash].css'),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
  ]

  prodPlugins.forEach(plugin =>
    config.plugins.push(plugin))
}

module.exports = config
