var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

const nodeModules = fs.readdirSync("./node_modules").filter(d => d != ".bin");

function ignoreNodeModules(context, request, callback) {
  if (request[0] == ".") {
    return callback();
  }

  const module = request.split("/")[0];
  if (nodeModules.indexOf(module)) {
    return callback(null, "commonjs " + request);
  }
}

function createConfig(isDebug) {
  const plugins = [];

  if (!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  return {
    // Webpack config
    target: "node",
    devtool: "source-map",
    entry: "./src/server/server.js",
    output: {
      path: path.join(__dirname, "build"),
      filename: "server.js"
    },

    resolve: {
      alias: {
        shared: path.join(__dirname, "src", "shared")
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
        { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
      ]
    },
    externals: [ignoreNodeModules],
    plugins: plugins
  }
}

module.exports = createConfig(true);
module.exports.create = createConfig;
