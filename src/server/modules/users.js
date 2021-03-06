import _ from 'lodash';
import {Observable} from 'rxjs';

import {ModuleBase} from '../lib/module.js';
import {validateLogin} from '../../shared/validation/users.js';
import {fail, success} from '../../shared/observable-socket.js';


const AuthContext = Symbol('AuthContext');

export class UserModule extends ModuleBase {
  constructor(io) {
    super();
    this._io = io;
    this._userList = [];
    this._users = {};
  }


  getColorForUsername(username) {
    let hash = _.reduce(username, (hash, ch) => ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash, 0);

    hash = Math.abs(hash);
    const hue = hash % 360;
    const saturation = hash % 25 + 70;
    const lightness = 100 - (hash % 15 + 35);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getUserForClient(client) {
    const auth = client[AuthContext];
    if (!auth) {
      return null;
    }

    return auth.isLoggedIn ? auth : null;
  }

  loginClient$(client, username) {
    username = username.trim();

    const validator = validateLogin(username);
    if (!validator.isValid) {
      return validator.throw$();
    }

    if (this._users.hasOwnProperty(username)) {
      return fail(`Username ${username} is already taken`);
    }

    const auth = client[AuthContext] || (client[AuthContext] = {});

    if (auth.isLoggedIn) {
      return fail('You already logged in');
    }

    auth.name = username;
    auth.color = this.getColorForUsername(username);
    auth.isLoggedIn = true;

    this._users[username] = client;
    this._userList.push(auth);

    this._io.emit('users:added', auth);
    console.log(`User ${username} logged in`);
    return Observable.of(auth);
  }

  logoutClient(client){
    const auth = this.getUserForClient(client);

    if (!auth) {
      return;
    }

    const index = this._userList.indexOf(auth);
    this._userList.splice(index, 1);
    delete this._users[auth.name];
    delete client[AuthContext];

    this._io.emit('users:removed', auth);
    console.log(`User ${auth.name} logged out`);
  }

  registerClient(client) {
    client.onActions({
      'user:list': () => {
        return this._userList;
      },

      'auth:login': ({name}) =>{
        return this.loginClient$(client, name);
      },

      'auth:logout': () => {
        this.logoutClient(client);

      }
    });

    client.on('disconnect', () => {
      this.logoutClient(client);
    });
  }
}
