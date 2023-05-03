import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import CustomersTable from './CustomersTable';
import actions from '../../store/rootActions';

const CustomersPage = props => {
  const {
    customer: { customersLoader },
    populateCustomers,
  } = props;

  React.useEffect(() => {
    return () => {
      populateCustomers({ empty: true });
    };
  }, [populateCustomers]);

  return (
    <div className="px-2 pb-3">
      {!customersLoader.fetchAllCustomers && <CustomersTable />}
      {customersLoader.fetchAllCustomers && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    customer: state.customer,
  };
}

CustomersPage.propTypes = {
  customer: PropTypes.object.isRequired,
  populateCustomers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(CustomersPage);
