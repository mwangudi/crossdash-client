import React from 'react';
import { Select, MenuItem, FormHelperText } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  .MuiSelect-filled.MuiSelect-filled {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .text-label {
    font-size: 14px;
  }
`;

const CustomSelectField = props => {
  const { label, options, error, helperText, ...rest } = props;

  return (
    <Div className="mb-2 d-flex flex-column">
      <span className="text-label">{label}</span>
      <Select {...rest}>
        {React.Children.toArray(
          options.map(option => (
            <MenuItem value={option.value}>{option.title}</MenuItem>
          )),
        )}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Div>
  );
};

CustomSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

CustomSelectField.defaultProps = {
  error: false,
  helperText: '',
};

export default CustomSelectField;
