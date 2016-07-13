import gulp from 'gulp';
import webpack from 'webpack';
import chalk from 'chalk';
import rimraf from 'rimraf';
import {create as createServerConfig} from './webpack.server.js';


const $ = require("gulp-load-plugins")();


//----------------------

gulp.task("clean:server", cb => rimraf('./build', cb));
gulp.task("clean:client", cb => rimraf('./public/build', cb));
