import {ElementComponent} from '../../lib/component.js';

import {PlayListSortComponent} from './sort.js';

export class PlayListListComponent extends ElementComponent {
  constructor(playlistStore, usersStore) {
    super('div');
    this._playlist = playlistStore;
    this._users = usersStore;
    this.$element.addClass('playlist-list');
  }

  _onAttach() {
    const sort = new PlayListSortComponent();
    sort.attach(this._$mount);
    this.children.push(sort);


    this._playlist.state$.compSubscribe(this, state => {
      console.log(state);
    });
  }
}
