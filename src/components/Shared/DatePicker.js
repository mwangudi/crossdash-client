import React from 'react';
import DateUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import dayjs from 'dayjs';

const Div = styled.div`
  .text-label {
    font-size: 14px;
  }

  .MuiFormLabel-root {
    color: transparent;
  }

  .MuiFormControl-marginNormal {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .MuiInput-formControl {
    margin-top: 9px;
  }

  .MuiFilledInput-input {
    padding: 10px 12px 10px;
  }
`;

const CustText = ({ variant, ...rest }) => {
  return <TextField variant="filled" {...rest} />;
};

CustText.propTypes = {
  variant: PropTypes.any,
};

CustText.defaultProps = {
  variant: null,
};

const DatePicker = props => {
  const { label, maxDate, ...rest } = props;

  return (
    <MuiPickersUtilsProvider utils={DateUtils}>
      <Div className="d-flex flex-column mb-2">
        <span className="text-label">{label}</span>
        <KeyboardDatePicker
          margin="normal"
          label={label}
          format="Do/MMM/YYYY"
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          maxDate={maxDate}
          TextFieldComponent={CustText}
          {...rest}
        />
      </Div>
    </MuiPickersUtilsProvider>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  maxDate: PropTypes.object,
};

DatePicker.defaultProps = {
  maxDate: dayjs(),
};

export default DatePicker;
