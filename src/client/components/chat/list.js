import $ from 'jquery';
import moment from 'moment';
import {Observable} from 'rxjs';
import {ElementComponent} from '../../lib/component.js';

export class ChatListComponent extends ElementComponent {
  constructor(server, userStore, chatStore) {
    super('ul');
    this._server = server;
    this._users = userStore;
    this._chat = chatStore;
    this.$element.addClass('chat-messages');
  }

  _onAttach() {
    Observable.merge(
      this._chat.messages$.map(chatMessageFactory))
      .filter(m => m)
      .compSubscribe(this, $newElement => {
        this.$element.append($newElement);
      });
  }
}

function chatMessageFactory({user, message, type, time}) {
  return $(`<li class='message' ${type} />`)
    .data('user', user.name)
    .append([
      $('<span class="author" />').text(user.name).css('color', user.color),
      $('<span class="message" />').text(message),
      $('<span class="time" />').text(moment(time).format('h:mm:ss a'))
    ]);
}
