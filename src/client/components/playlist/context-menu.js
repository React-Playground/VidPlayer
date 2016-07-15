import {ElementComponent} from '../../lib/component.js';

export class PlayListContextComponent extends ElementComponent {
  constructor() {
    super('div');
    this.$element.addClass('context-menu');
  }
}
