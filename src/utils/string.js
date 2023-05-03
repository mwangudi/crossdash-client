import {
  capitalize,
  camelCase,
  snakeCase,
  startCase,
  isString,
  isNumber,
  isEmpty,
} from 'lodash';

const isObject = value => {
  try {
    Object.setPrototypeOf({}, value);
    return value !== null;
  } catch (err) {
    return false;
  }
};

const convertKeys = (converter, object) => {
  if (!isObject(object)) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(o => convertKeys(converter, o));
  }

  const converted = {};

  Object.keys(object).map(prop => {
    converted[converter(prop)] = convertKeys(converter, object[prop]);
    return prop;
  });

  return converted;
};

export const camelizeKeys = object => convertKeys(camelCase, object);

export const decamelizeKeys = object => convertKeys(snakeCase, object);

export const capitalizeString = string => capitalize(string);

export const camelize = string => camelCase(string);

export const convertToStartCase = string => startCase(string);

export const decamelize = string => {
  if (string.includes('_') || string.includes('.')) {
    return string;
  }
  return snakeCase(string);
};

export const capitalizeWord = value => {
  if (!value) return '';
  const newValue = value.toString();
  return newValue.charAt(0).toUpperCase() + newValue.slice(1);
};

export const capitalizePhrase = value => {
  if (!value) return '';
  const newValue = value.toString();
  return newValue.replace(/\b[a-z]/g, f => f.toUpperCase());
};

export const concat = (value1, value2) => {
  if (!value1 || !value2) return '';
  return `${value1} ${value2}`;
};

export const maskPhoneNumber = value => {
  if (!value) return '';
  return `+${value
    .toString()
    .match(/.{1,3}/g)
    .join('-')}`;
};

/**
 * Changes value to past tense.
 * Simple filter does not support irregular verbs such as eat-ate, fly-flew, etc.
 * http://jsfiddle.net/bryan_k/0xczme2r/
 *
 * @param {String} value The value string.
 */
export const pastTense = string => {
  if (!string) {
    return '';
  }

  // Ensure entry value is string and lowercase
  const value = string.toString().toLowerCase();

  // Slightly follows http://www.oxforddictionaries.com/us/words/verb-tenses-adding-ed-and-ing
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  const last = value.toLowerCase().substr(value.length - 1);
  const secondLast = value.toLowerCase().substr(value.length - 2, 1);
  const thirdLast = value.toLowerCase().substr(value.length - 3, 1);
  const lastTwo = value.toLowerCase().substr(value.length - 2);
  const lastThree = value.toLowerCase().substr(value.length - 3);
  const inArray = (ar, v) => ar.indexOf(v) !== -1;

  // participle or already past tense, don't want
  if (lastThree === 'ing' || lastTwo === 'ed') {
    return value;
  }

  // Ends in 'e', simply add the 'd'
  if (last === 'e') {
    return `${value}d`;
  }

  // Ends in 'c', add the 'ked'
  if (last === 'c') {
    return `${value}ked`;
  }

  // Ends with consonant, vowel, consonant. I'm simple, double consonant and add 'ed'
  // Add exception for verb destroy
  if (
    !inArray(vowels, thirdLast) &&
    inArray(vowels, secondLast) &&
    !inArray(vowels, last) &&
    value !== 'destroy'
  ) {
    return `${value + last}ed`;
  }

  return `${value}ed`;
};

export const appendSuffixToNumber = no => {
  const j = no % 10;
  const k = no % 100;

  if (j === 1 && k !== 11) {
    return `${no}st`;
  }
  if (j === 2 && k !== 12) {
    return `${no}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${no}rd`;
  }
  return `${no}th`;
};

export const addCommasToNumbers = (no = '') => {
  if (isString(no) && !isEmpty(no)) {
    return Number(no).toLocaleString();
  }
  if (isNumber(no)) {
    return no.toLocaleString();
  }
  return no;
};

export default {
  capitalizeString,
  capitalizeWord,
  capitalizePhrase,
  concat,
  camelize,
  camelizeKeys,
  decamelize,
  decamelizeKeys,
  maskPhoneNumber,
  pastTense,
  convertToStartCase,
  appendSuffixToNumber,
  addCommasToNumbers,
};
