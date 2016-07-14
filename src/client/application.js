import './application.scss';

import * as services from './services.js';

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

