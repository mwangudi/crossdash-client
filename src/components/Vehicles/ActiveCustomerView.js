import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import actions from '../../store/rootActions';
import VehicleProfile from './VehicleProfile';

const ActiveCustomerView = props => {
  const {
    auth: {
      authUser: {
        customer: { id, type },
      },
    },
    customer: { customersLoader },
    fetchCustomer,
  } = props;

  React.useEffect(() => {
    const fetchCustomerAsync = async () => {
      await fetchCustomer({
        scope: isEqual(type, 'individual_customer')
          ? '/individual_customers'
          : '/corporate_customers',
        fingerprint: id,
      });
    };

    fetchCustomerAsync();
  }, [fetchCustomer, id, type]);

  return (
    <div className="container">
      <div className="col-12">
        <Typography variant="h6" className="mt-2 mb-3">
          Vehicle Profile
        </Typography>
      </div>
      {customersLoader.fetchCustomer && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
      {!customersLoader.fetchCustomer && <VehicleProfile />}
    </div>
  );
};
ActiveCustomerView.propTypes = {
  auth: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    customer: state.customer,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(ActiveCustomerView);
