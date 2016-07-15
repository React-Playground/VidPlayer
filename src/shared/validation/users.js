import {Validator} from '../validator.js';

export let USERNAME_REGEX = /^[\w\d_0]+$/;

export function validateLogin(username) {
  const validator = new Validator();

  if (username.length >= 20) {
    validator.error('Username must be fewwer then 20 characters');
  }

  if (!USERNAME_REGEX.test(username)) {
    validator.error('Username can only containt numbers digits underscores and dashes');
  }

  return validator;
}
