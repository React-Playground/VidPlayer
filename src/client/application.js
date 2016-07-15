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

/*******
** Bootstrap
 ******/
services.socket.connect();

/*******
** Config
 ******/
if (module.hot) {
  module.hot.accept();
}

