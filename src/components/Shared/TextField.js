import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  .MuiFilledInput-inputMarginDense {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .MuiFilledInput-multiline.MuiFilledInput-marginDense {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .MuiInputLabel-filled.MuiInputLabel-marginDense {
    color: transparent;
  }

  .text-label {
    font-size: 14px;
  }
`;

const CustomTextField = props => {
  const { label, ...rest } = props;
  return (
    <Div className="mb-2">
      <span className="text-label">{label}</span>
      <TextField size="small" label={label} className="text-field" {...rest} />
    </Div>
  );
};

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
};

export default CustomTextField;
