import _ from 'lodash';

import {Validator} from '../validator.js';

export let MESSAGE_TYPES = ['normal'];

export function validateSendMessage(error, message, type) {
  const validator = new Validator();

  if (message.length > 50) {
    validator.error('Message must be smaller then 50 messages');
  }

  if (message.length === 0) {
    validator.error('Message cannot be empty');
  }

  if (!_.includes(MESSAGE_TYPES, type)) {
    validator.error('Invalid message type ${type}');
  }

  console.log(validator);
  return validator;
}
