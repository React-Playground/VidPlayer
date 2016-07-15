import $ from 'jquery';
import {ComponentBase} from '../../lib/component.js';

import './chat.scss';

import {ChatListComponent, } from './list.js';
import {ChatFormComponent} from './form.js';

class ChatComponent extends ComponentBase {
  constructor() {
    super('ul');
  }


  _onAttach() {
    const $title = this._$mount.find('> h1');
    $title.text('');

    const list = new ChatListComponent();
    list.attach(this._$mount);
    this.children.push(list);


    const form = new ChatFormComponent();
    form.attach(this._$mount);
    this.children.push(form);
  }
}

let component;

try {
  component = new ChatComponent();
  component.attach($('section.chat'));
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
