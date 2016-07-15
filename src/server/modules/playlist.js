import {ModuleBase} from '../lib/module.js';

export class PlaylistModule extends ModuleBase {
  constructor(io, usersModule, playlistRepository, videoServices) {
    super();
    this._io = io;
    this._users = usersModule;
    this._repository = playlistRepository;
    this._services = videoServices;
  }
}
