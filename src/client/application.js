import './application.scss';

import * as services from './services.js';
/*******
** Playground
 ******/
services.server.emitAction$('login', {username: 'foo', password: 'bar'})
  .subscribe(user => {
    console.log('We are logged in ' + user);
  }, error => {
    console.log(error);
  });


/*******
** Auth
 ******/

/*******
** Components
******/
require('./components/player/player.js');
require('./components/users/users.js');
require('./components/chat/chat.js');
require('./components/playlist/playlist.js');

/*******
** Bootstrap
 ******/
services.socket.connect();

services.usersStore.state$.subscribe(state => {
  console.log(state);
});

/*******
** Config
 ******/

