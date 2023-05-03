import React from 'react';
import { Switch } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  .text-label {
    font-size: 14px;
  }

  .helperText {
    font-size: 0.75rem;
  }

  .options-label {
    font-size: 13px;
  }

  .switch {
    width: 42px;
    height: 26px;
    padding: 0;
  }

  .MuiSwitch-switchBase {
    padding: 1px;

    &.Mui-checked {
      transform: translateX(16px);
      color: ${({ theme }) => theme.palette.common.white};
    }

    &.Mui-checked + .MuiSwitch-track {
      background-color: #52d869;
      opacity: 1;
      border: none;
    }

    &.Mui-focusVisible .MuiSwitch-thumb {
      color: #52d869;
      border: 6px solid #fff;
    }
  }

  .MuiSwitch-thumb {
    width: 24px;
    height: 24px;
  }

  .MuiSwitch-track {
    border: 1px solid ${({ theme }) => theme.palette.grey[400]};
    border-radius: 11px;
    background-color: ${({ theme }) => theme.palette.grey[300]};
    opacity: 1;
    transition: ${({ theme }) =>
      theme.transitions.create(['background-color', 'border'])};
  }
`;

const CustomSwitch = props => {
  const {
    label,
    switchLabelPrimary,
    switchLabelSecondary,
    helperText,
    error,
    ...rest
  } = props;
  return (
    <Div className="mb-2">
      <span className="text-label">{label}</span>
      <div className="d-flex flex-column my-1">
        <div className="d-flex flex-row align-items-center">
          {switchLabelSecondary && (
            <span className="options-label mr-1">{switchLabelSecondary}</span>
          )}
          <Switch
            focusVisibleClassName="focusVisible"
            className="switch"
            {...rest}
          />
          <span className="options-label ml-1">{switchLabelPrimary}</span>
        </div>
      </div>
      {error && <span className="helperText">{helperText}</span>}
    </Div>
  );
};

CustomSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  switchLabelPrimary: PropTypes.string.isRequired,
  switchLabelSecondary: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

CustomSwitch.defaultProps = {
  switchLabelSecondary: '',
  helperText: '',
  error: false,
};

export default CustomSwitch;
