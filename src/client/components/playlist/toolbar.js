import {ElementComponent} from '../../lib/component.js';

export class PlayListToolbarComponent extends ElementComponent {
  constructor() {
    super('div');
    this.$element.addClass('toolbar');
  }
}
