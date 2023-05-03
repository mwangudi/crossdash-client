import _ from 'lodash';

export const roundUp = (value, decimalPoints = 1) => {
  if (value === 0) {
    return 0;
  }
  return _.isNumber(value) * _.round(value, decimalPoints);
};

export const dataPreprocessor = (data, propTitle) => {
  const newValue = {};
  _.forEach({ ...data }, (value, key) => {
    const keyVal = _.split(key, '[]')[0];
    const propLabel = `${propTitle}[${keyVal}]${
      _.includes(key, '[]') ? '[]' : ''
    }`;
    newValue[propLabel] = value;
  });
  return newValue;
};

const preProcessor = (data, propTitle) => {
  const newValue = {};
  _.forEach({ ...data }, (value, key) => {
    const propLabel = `${propTitle}${key}`;
    newValue[propLabel] = value;
  });
  return newValue;
};

export const dataPreprocessArray = (data, propTitle) => {
  let dataObj = {};
  _.forEach([...data], (value, key) => {
    const newValue = preProcessor(value, `${propTitle}[${key}]`);
    dataObj = {
      ...dataObj,
      ...newValue,
    };
  });
  return dataObj;
};

export const extractDataToFile = data => {
  const formData = new FormData();
  _.forEach(
    {
      ...data,
    },
    (value, key) => {
      if (
        _.isArray(value) &&
        !_.isEmpty(value) &&
        !_.isNil(value[0].size) &&
        !_.isNil(value[0].type)
      ) {
        _.forEach(value, fmData => {
          formData.append(key, fmData);
        });
      } else {
        formData.append(key, value);
      }
    },
  );
  return formData;
};

export const checkRole = (mainRole, roles) => roles.includes(mainRole);

export default {
  dataPreprocessor,
  dataPreprocessArray,
  extractDataToFile,
  roundUp,
  checkRole,
};
