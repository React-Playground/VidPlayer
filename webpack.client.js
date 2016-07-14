var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const dirname = path.resolve('./');


const vendorModules = ['jquery'];

function createConfig(isDebug) {
  const devTool = isDebug ? 'eval-source-map' : 'source-map';
  const plugins = [new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')];

  const cssLoader = {test: /\.css$/, loader: 'style!css'};
  const sassLoader = {test: /\.scss/, loader: 'style!css!sass'};
  const appEntry = ['./src/client/application.js',];

  if (!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(new ExtractTextPlugin('[name].css'));

    cssLoader.loader = ExtractTextPlugin.extract('style', 'css');
    sassLoader.loader = ExtractTextPlugin.extract('style', 'css!sass');
  } else {
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());

    appEntry.splice(0,0, 'webpack-hot-middleware/client');
  }

  return {
    devtool: devTool,
    entry: {
      application: appEntry,
      vendor: vendorModules
    },
    output: {
      path: path.join(dirname, 'public', 'build'),
      filename: '[name].js',
      publicPath: '/build/',
    },
    publicPath: '/',
    resolve: {
      alias: {
        shared: path.join(dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
        { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: 'url-loader?limit=1024' },
        cssLoader,
        sassLoader
      ]
    },
    plugins: plugins
  };
}

module.exports = createConfig(true);
module.exports.create = createConfig;

