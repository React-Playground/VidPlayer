import io from 'socket.io-client';

import { ObservableSocket } from '../shared/observable-socket.js';

export const socket = io({ autoConnect: false });
export const server = new ObservableSocket(socket);
