import io from 'socket.io-client';

import { ObservableSocket } from '../shared/observable-socket.js';
import { UsersStore} from './stores/users.js';
import { ChatStore } from './stores/chat.js';
import { PlaylistStore } from './stores/playlist.js';

export const socket = io({ autoConnect: false });
export const server = new ObservableSocket(socket);

export const usersStore = new UsersStore(server);
export const chatStore = new ChatStore(server, usersStore);
export const playlistStore = new PlaylistStore(server);
