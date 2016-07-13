var path = require('path');
var webpack = require('webpack');
const dirname = path.resolve('./');


const vendorModules = ["jquery"];


function createConfig(isDebug) {
  const devTool = isDebug ? "eval-source-map" : "source-map";
  const plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];

  const cssLoader = {test: /\.css$/, loader: "style!css"};
  const sassLoader = {test: /\.scss/, loader: "style!css!sass"};
  const appEntry = ["./src/client/application.js",];

  return {
    devtool: devTool,
    entry: {
      application: appEntry,
      vendor: vendorModules
    },
    output: {
      path: path.join(dirname, 'public', 'build'),
      filename: '[name].js',
      publicPath: '/build/'
    },
    resolve: {
      alias: {
        shared: path.join(dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
        { test: /\.js$/, loader: "eslint", exclude: /node_modules/ },
        { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=1024" },
        cssLoader,
        sassLoader
      ]
    },
    plugins: plugins
  };
}

module.exports = createConfig(true);
module.exports.create = createConfig;

