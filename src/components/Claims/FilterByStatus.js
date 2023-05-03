import React from 'react';
import { Button, Menu, List, ListItem, ListItemText } from '@material-ui/core';
import PropTypes from 'prop-types';
import Icon from 'react-icons-kit';
import { ic_arrow_drop_down as icArrowDown } from 'react-icons-kit/md/ic_arrow_drop_down';

const FilterByStatus = props => {
  const { status, setStatus } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = selectedStatus => () => {
    setStatus(selectedStatus);
    handleClose();
  };

  const showPickedStatus = s => {
    switch (s) {
      case 'in_processing':
        return 'Processing';
      case 'back_to_customer':
        return 'back to customer';
      default:
        return s;
    }
  };

  return (
    <div>
      <Button
        aria-controls="filter-claims-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <div className="d-flex flex-row align-items-center px-1">
          <span className="text-capitalize">
            Pick by status ({showPickedStatus(status)})
          </span>
          <Icon icon={icArrowDown} />
        </div>
      </Button>
      <Menu
        id="filter-claims-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List dense className="px-1">
          <ListItem button onClick={handleSelectStatus('new')}>
            <ListItemText primary="New" />
          </ListItem>
          <ListItem button onClick={handleSelectStatus('in_processing')}>
            <ListItemText primary="Processing" />
          </ListItem>
          <ListItem button onClick={handleSelectStatus('back_to_customer')}>
            <ListItemText primary="Back to customer" />
          </ListItem>
          <ListItem button onClick={handleSelectStatus('rejected')}>
            <ListItemText primary="Rejected" />
          </ListItem>
          <ListItem button onClick={handleSelectStatus('approved')}>
            <ListItemText primary="Approved" />
          </ListItem>
        </List>
      </Menu>
    </div>
  );
};

FilterByStatus.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default FilterByStatus;
