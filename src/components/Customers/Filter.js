import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@material-ui/core';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { ic_arrow_drop_down as icArrowDown } from 'react-icons-kit/md/ic_arrow_drop_down';

import actions from '../../store/rootActions';

const Div = styled.div`
  .sp-button {
    text-transform: none;
  }
`;

const CustomerFilter = props => {
  const {
    customer: { individualCustomerType },
    toggleCustomerType,
    populateCustomers,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIndividual = () => {
    toggleCustomerType(true);
    populateCustomers({ empty: true });
    handleClose();
  };

  const handleCorporate = () => {
    toggleCustomerType(false);
    populateCustomers({ empty: true });
    handleClose();
  };

  return (
    <Div className="px-2">
      <Button
        aria-controls="sp-customer-type-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="sp-button"
      >
        <div className="d-flex flex-row align-items-center">
          <span className="pr-1">
            {individualCustomerType ? 'Individual' : 'Corporate'}
          </span>
          <Icon icon={icArrowDown} />
        </div>
      </Button>
      <Menu
        id="sp-customer-type-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleIndividual}>Individual</MenuItem>
        <MenuItem onClick={handleCorporate}>Corporate</MenuItem>
      </Menu>
    </Div>
  );
};

CustomerFilter.propTypes = {
  customer: PropTypes.object.isRequired,
  toggleCustomerType: PropTypes.func.isRequired,
  populateCustomers: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    customer: state.customer,
  };
}

export default connect(mapStateToProps, actions)(CustomerFilter);
