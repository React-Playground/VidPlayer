import { Observable, ReplaySubject } from 'rxjs';

export function clientMessage(message) {
  const error = new Error(message);
  error.clientMessage = message;
  return error;
}

export function fail(message) {
  return Observable.throw({clientMessage: message});
}

let successObservable = Observable.empty();
export function success(message) {
  return successObservable;
}

export class ObservableSocket {
  get isConnected() { return this._state.isConnected; }
  get isReconeting() { return this._state.isReconecting; }
  get isTotallyDead() { return !this._state.isConnected && !this._state.isReconecting; }

  constructor(socket) {
    this._socket = socket;
    this._state = {};
    this._actionCallbacks = {};
    this._request = {};
    this._nextRequestId = 0;

    this.status$ = Observable.merge(
      this.on$('connect').map(() => ({isConnected: true})),
      this.on$('disconnect').map(() => ({isConnected: false})),
      this.on$('isReconeting').map(attemp => ({isConnected: false, isReconecting: true, attemp })),
      this.on$('reconnect_failed').map(() => ({isConnected: false, isReconecting: false})))
      .publishReplay()
      .refCount();
    this.status$.subscribe(state => this._state = state);
  }

  on$(event) {
    return Observable.fromEvent(this._socket, event);
  }

  on(event, callback) {
    this._socket.on(event, callback);
  }

  off(event, callback) {
    this._socket.off(event, callback);
  }

  emit(event, arg) {
    this._socket.emit(event, arg);
  }

  //-------------
  // Emit (Client Side)
  emitAction$(action, arg) {
    const id = this._nextRequestId++;
    this._registerCallbacks(action);

    const subject = this._request[id] = new ReplaySubject(1);
    this._socket.emit(action, arg, id);

    return subject;
  }

  _registerCallbacks(action) {
    if (this._actionCallbacks.hasOwnProperty(action)) {
      return;
    }

    this._socket.on(action, (arg, id) => {
      const request = this._popRequest(id);
      if (!request) {
        return;
      }

      request.next(arg);
      request.complete();
    });

    this._socket.on(`${action}:fail`, (arg, id) => {
      const request = this._popRequest(id);
      if (!request) {
        return;
      }

      request.error(arg);
    });

    this._actionCallbacks[action] = true;
  }

  _popRequest(id) {
    if (!this._request.hasOwnProperty(id)) {
      console.log(`Event with id ${id} was returned twice or the server did not send back an ID!`);
      return;
    }

    const request = this._request[id];
    delete this._request[id];
    return request;
  }

  //------------
  // On (server side)
  onAction(action, callback) {
    this._socket.on(action, (arg, id) => {
      try {
        const value = callback(arg);
        console.log(value);

        if (!value) {
          this._socket.emit(action, null, id);
          return;
        }

        if (!value.subscribe) {
          this._socket.emit(action, value, id);
          return;
        }

        let hasValue = false;

        value.subscribe({
          next: (item) => {
            if (hasValue) {
              throw new Error(`Action ${action} produced more than one value`);
            }

            this._socket.emit(action, item, id);
            hasValue = true;
          },

          error: (error) => {
            this._emitError(action, id, error);
            console.error(error.stack || error);

          },

          complete: () => {
            if (!hasValue) {
              this._socket.emit(action, null, id);
            }
          }
        });
      }
      catch(error) {
        if (typeof id !== undefined) {
          this._emitError(action, id, error);
        }

        console.error(error.stack || error);
      }
    });
  }

  onActions(actions) {
    for (let action in actions) {
      if (!actions.hasOwnProperty(action))
        continue;

      this.onAction(action, actions[action]);
    }
  }

  _emitError(action, id, error) {
    const message = (error && error.clientMessage) || 'Fatal Error';
    this._socket.emit(`${action}:fail`, {message}, id);
  }
}
