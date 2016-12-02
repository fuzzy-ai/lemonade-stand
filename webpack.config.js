var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: ['./public/assets/js/app']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public', 'assets'),
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      { test: /\.sass$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?sourceMap=true') }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    extensions: ['', '.js', '.sass'],
    root: [path.join(__dirname, 'public', 'assets')]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
}
