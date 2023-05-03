import _ from 'lodash';
import dayjs from 'dayjs';

export const cleanFormErrors = errors => {
  const returnBlock = {};

  if (errors !== undefined) {
    errors.map(e => {
      const { pointer } = e.source;
      const attr = pointer.substring(
        pointer.lastIndexOf('/') + 1,
        pointer.length,
      );

      if (attr.indexOf('.') !== -1) {
        const parent = attr.substring(0, attr.indexOf('.'));
        const child = attr.substring(attr.indexOf('.') + 1, attr.length);

        returnBlock[parent] = {};

        returnBlock[parent][child] = e.detail;

        returnBlock[parent][`${child}_key`] = true;
      } else {
        returnBlock[attr] = e.detail;

        returnBlock[`${attr}_key`] = true;
      }
      return returnBlock;
    });
  }
  return returnBlock;
};

export const validPhoneNumber = value => {
  if (_.isEmpty(value)) return true;
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g;
  return phoneRegex.test(value);
};

export const legalAgeLimit = value => {
  const currentDate = dayjs().subtract(17, 'year');
  const passedDate = dayjs(value);
  const under18 = passedDate.isBefore(currentDate, 'year');
  return under18;
};

export default {
  cleanFormErrors,
  validPhoneNumber,
};
