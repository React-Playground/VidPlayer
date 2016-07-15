import {ElementComponent} from '../../lib/component.js';

import {PlayListSortComponent} from './sort.js';

export class PlayListListComponent extends ElementComponent {
  constructor() {
    super('div');
    this.$element.addClass('playlist-list');
  }

  _onAttach() {
    const sort = new PlayListSortComponent();
    sort.attach(this._$mount);
    this.children.push(sort);
  }
}
