import api from './api';
import error from './error';
import list from './list';
import time from './time';
import string from './string';
import data from './data';

export default {
  ...api,
  ...error,
  ...list,
  ...time,
  ...string,
  ...data,
};

export * from './api';
export * from './error';
export * from './list';
export * from './time';
export * from './string';
export * from './data';
