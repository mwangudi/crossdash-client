import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';

const Div = styled.div`
  .text-label {
    font-size: 14px;
  }

  .radio-label {
    margin-bottom: 0;
  }

  .helperText-label {
    margin-top: 0;
  }
`;

const CustomRadioField = props => {
  const { label, options, error, helperText, ...rest } = props;

  return (
    <Div className="mb-2 d-flex flex-column">
      <span className="text-label">{label}</span>
      <RadioGroup aria-label={label} name={label} row {...rest}>
        {React.Children.toArray(
          options.map(option => (
            <FormControlLabel
              className="radio-label"
              value={option.value}
              control={<Radio color="primary" />}
              label={option.title}
            />
          )),
        )}
      </RadioGroup>
      <FormHelperText className="helperText-label" error={error}>
        {helperText}
      </FormHelperText>
    </Div>
  );
};

CustomRadioField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

CustomRadioField.defaultProps = {
  error: false,
  helperText: '',
};

export default CustomRadioField;
