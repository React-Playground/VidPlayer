import {Observable} from 'rxjs';
import _ from 'lodash';

export class UsersStore {
  constructor(server) {
    this._server = server;

    const defaultStore = {users: []};
    const events$ = Observable.merge(
      this._server.on$('user:list').map(opList),
      this._server.on$('users:added').map(opAdd)
    );

    this.state$ = events$
    .scan(function(last, op) {
      return op(last.state);
    }, {state: defaultStore})
    .publishReplay(1);

    console.log(this);
    this.state$.connect();


    this._server.on('connect', () => {
      this._server.emit('user:list');
    });
  }
}

function opList(users) {
  return state => {
    state.users = users;
    state.users.sort((l, r) => l.name.localeCompare(r.name));
    return {
      type: 'list',
      state: state
    };
  };
}
function opAdd(user) {
  return state => {
    let insertIndex = _.findIndex(state.users, u => u.name.localeCompare(user.name) > 0);

    if (insertIndex === -1) {
      insertIndex = state.users.length;
    }

    state.users.splice(insertIndex, 0, user);
    return {
      type: 'add',
      user: user,
      state: state
    };
  };
}
