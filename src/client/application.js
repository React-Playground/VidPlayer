import $ from 'jquery';

import '../shared/operators.js';

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
const $html = $('html');
services.usersStore.currentUser$.subscribe(user => {
  if (user.isLoggedIn) {
    $html.removeClass('not-logged-in');
    $html.addClass('logged-in');
  } else {
    $html.removeClass('logged-in');
    $html.addClass('not-logged-in');
  }
});



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
/*******
** Config
 ******/

