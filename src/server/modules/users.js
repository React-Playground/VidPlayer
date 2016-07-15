import {ModuleBase} from '../lib/module.js';

export class UserModule extends ModuleBase {
  constructor(io) {
    super();
    this._io = io;
  }
}
