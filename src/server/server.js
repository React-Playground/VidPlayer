import 'source-map-support/register';

import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import chalk from 'chalk';
import {Observable} from 'rxjs';

import {ObservableSocket} from '../shared/observable-socket.js';

import {UserModule} from './modules/users.js';
import {ChatModule} from './modules/chat.js';
import {PlaylistModule} from './modules/playlist.js';

const isDevelopment = process.env.NODE_ENV !== 'production';
/*******
 ************ Setup
 ******/
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

/*******
 ************ Client Webpack
 ******/
if (process.env.USE_WEBPACK) {
  var webpackMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var clientConfig = require('../../webpack.client.js');

  const compiler = webpack(clientConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: '/build/',
    hot: true,
    stats: {
      colors: true,
      chunks: false,
      assets: false,
      timings: false,
      modules: false,
      hash: false,
      version: false
    }
  }));

  app.use(webpackHotMiddleware(compiler, {publicPath: '/build/'}));
  console.log(chalk.bgRed('Using Webpack dev middleware! DEV ONLY'));
}

/*******
 ************ Configure Express
 ******/

app.set('view engine', 'jade');
app.use(express.static('./public'));

const useExternalStyles = !isDevelopment;
app.get('/', (req, res) => {
  res.render('index', {
    useExternalStyles
  });
});

/*******
 ************ Services
 ******/
const videoServices = [];
const playlistRepository = {};

/*******
 ************ Modules
 ******/
const users = new UserModule(io);
const chat = new ChatModule(io, users);
const playlist = new PlaylistModule(io, users, playlistRepository, videoServices);
const modules = [users, chat, playlist];

/*******
 ************ Socket
 ******/

io.on('connection',  socket => {
  console.log(`got connection from ${socket.request.connection.remoteAddress}`);

  const client = new ObservableSocket(socket);

  for (let mod of modules) {
    mod.registerClient(client);
  }

  for (let mod of modules) {
    mod.clientRegistered(client);
  }
});

/*******
 ************ Startup
 ******/
const port = process.env.PORT || 3000;
function startServer() {
  server.listen(port, () => {
    console.log(`Started http server on port ${port}`);
  });
}

Observable.merge(...modules.map(m => m.init$()))
  .subscribe({
    complete() {
      startServer();
    },
    error(error) {
      console.error(`Could not init module: ${error.stack || error}`);
    }
  });

