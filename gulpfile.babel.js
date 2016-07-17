import gulp from 'gulp';
import webpack from 'webpack';
import chalk from 'chalk';
import rimraf from 'rimraf';
import {create as createServerConfig} from './webpack.server.js';
import {create as createClientConfig} from './webpack.client.js';

const $ = require('gulp-load-plugins')();


//----------------------
// Public task

gulp.task('clean:server', cb => rimraf('./build', cb));
gulp.task('clean:client', cb => rimraf('./public/build', cb));
gulp.task('clean', gulp.parallel('clean:server', 'clean:client'));

gulp.task('dev:server', gulp.series('clean:server', devServerBuild));
gulp.task('dev', gulp.series('clean',
                             devServerBuild,
                             gulp.parallel(
                               devServerWatch,
                               devServerReload)));

gulp.task('prod:server', gulp.series('clean:server', prodServerBuild));
gulp.task('prod:client', gulp.series('clean:client', prodClientBuild));
gulp.task('prod', gulp.series('clean', gulp.parallel(prodClientBuild, prodServerBuild)));

//--------------------
// Private Client Task
function prodClientBuild(callback) {
  const compiler = webpack(createClientConfig(false));
  console.log(compiler);
  compiler.run((err, stats) => {
    outputWebpack('Prod:Client', err, stats);
    callback();
  });
}

//--------------------
// Private Server Task
const devServerWebpack = webpack(createServerConfig(true));
const prodServerWebpack = webpack(createServerConfig(false));

function devServerBuild(callback) {
  devServerWebpack.run((error, stats) => {
    outputWebpack('Dev:Server', error, stats);
    callback();
  });
}

function devServerWatch() {
  devServerWebpack.watch({}, (error, stats) => {
    outputWebpack('Dev:Server', error, stats);
  });
}

function devServerReload() {
  return $.nodemon({
    script: './build/server.js',
    watch: './build',
    env: {
      'NODE_ENV': 'development',
      'USE_WEBPACK': 'true'
    }
  });
}

function prodServerBuild(callback) {
  prodServerWebpack.run((error, stats)  => {
    outputWebpack('Prod:Server', error, stats);
    callback();
  });
}

//--------------------
//Helpers
function outputWebpack(label, error, stats) {
  if (error) {
    throw new Error(error);
  }

  if (stats.hasErrors()) {
    $.util.log(stats.toString({ colors: true }));
  } else {
    const time = stats.endTime - stats.startTime;
    $.util.log(chalk.bgGreen(`Built ${label} in ${time}ms`));
  }

}
