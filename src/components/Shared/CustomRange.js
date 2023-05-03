import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { DateRangePicker } from '@matharumanpreet00/react-daterange-picker';
import { Button, Popover } from '@material-ui/core';

const Div = styled.div``;

const CustomRange = props => {
  const { label, maxDate, onChange } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  const handleDateChange = range => {
    onChange(range);
    handleClose();
  };

  return (
    <Div>
      <Button aria-describedby={id} color="primary" onClick={handleClick}>
        <span className="text-capitalize">{label}</span>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <DateRangePicker maxDate={maxDate} open onChange={handleDateChange} />
      </Popover>
    </Div>
  );
};

CustomRange.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maxDate: PropTypes.object,
};

CustomRange.defaultProps = {
  maxDate: dayjs(),
};

export default CustomRange;
