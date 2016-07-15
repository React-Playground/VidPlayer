import {ModuleBase} from '../lib/module.js';
import _ from 'lodash';

export class UserModule extends ModuleBase {
  constructor(io) {
    super();
    this._io = io;
    this._userList = [
      {name: 'Foo', color: this.getColorForUsername('Foo')},
      {name: 'Bar', color: this.getColorForUsername('Bar')},
      {name: 'Baz', color: this.getColorForUsername('Baz')}
    ];
  }


  getColorForUsername(username) {
    let hash = _.reduce(username, (hash, ch) => ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash, 0);

    hash = Math.abs(hash);
    const hue = hash % 360;
    const saturation = hash % 25 + 70;
    const lightness = 100 - (hash % 15 + 35);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  registerClient(client) {
    let index = 0;
    setInterval(() => {
      const username = `New User ${index++}`;
      const user = {name:username, color: this.getColorForUsername(username)};
      client.emit('users:added', user);
    }, 2000);

    client.onActions({
      'user:list': () => {
        return this._userList;
      },

      'auth:login': () =>{

      },

      'auth:logout': () => {

      }
    });
  }
}
