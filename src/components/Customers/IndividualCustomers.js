import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import CustomersTable from './CustomersTable';
import actions from '../../store/rootActions';

const Dashboard = props => {
  const {
    customer: { customersLoader, customersPagination },
    fetchCustomers,
  } = props;

  React.useEffect(() => {
    const fetchCustomerAsync = async () => {
      await fetchCustomers({
        scope: '/individual_customers',
        query: {
          'page[size]': customersPagination.pageSize,
          'page[number]': customersPagination.pageNumber,
        },
      });
    };

    fetchCustomerAsync();
  }, [customersPagination, fetchCustomers]);

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

Dashboard.propTypes = {
  customer: PropTypes.object.isRequired,
  fetchCustomers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(Dashboard);
