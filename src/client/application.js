import $ from 'jquery';
import {blegh} from 'shared/test';
import './application.scss';

if (module.hot) {
  module.hot.accept();
}

blegh();

$('body').html('WHOA');
console.log('YESSS');
