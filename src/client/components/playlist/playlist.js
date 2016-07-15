import $ from 'jquery';
import {ComponentBase} from '../../lib/component.js';

import './playlist.scss';

import {PlayListListComponent} from './list.js';
import {PlayListToolbarComponent} from './toolbar.js';
import {PlayListContextComponent} from './context-menu.js';
import {PlayListChromeComponent} from './chrome.js';

class ChatComponent extends ComponentBase {
  constructor() {
    super();
  }

  _onAttach() {
    const $title = this._$mount.find('> h1');
    $title.text('Playlist');


    const toolbar = new PlayListToolbarComponent();
    toolbar.attach(this._$mount);

    this._$chrome = $('<div class="chrome" />').appendTo(this._$mount);
    this._$scrollArea = $('<div class="scroll-area" />').appendTo(this._$chrome);

    const list = new PlayListListComponent();
    list.attach(this._$scrollArea);

    const contextMenu = new PlayListContextComponent();
    contextMenu.attach(this._$scrollArea);

    const chrome = new PlayListChromeComponent();
    chrome.attach(this._$chrome);

    this.children.push(toolbar, list, contextMenu, chrome);

  }

  _onDetach() {
    this._$chrome.remove();
  }
}

let component;

try {
  component = new ChatComponent();
  component.attach($('section.playlist'));
} catch (e) {
  console.error(e);
  if (component) {
    component.detach();
  }
}
finally {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => component && component.detach());
  }
}