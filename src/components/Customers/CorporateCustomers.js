import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import CorporateCustomersTable from './CorporateCustomersTable';
import actions from '../../store/rootActions';

const Dashboard = props => {
  const {
    customer: { customersLoader, corporateCustomersPagination },
    fetchCorporateCustomers,
  } = props;

  React.useEffect(() => {
    const fetchCustomerAsync = async () => {
      await fetchCorporateCustomers({
        scope: '/corporate_customers',
        query: {
          'page[size]': corporateCustomersPagination.pageSize,
          'page[number]': corporateCustomersPagination.pageNumber,
        },
      });
    };

    fetchCustomerAsync();
  }, [corporateCustomersPagination, fetchCorporateCustomers]);

  return (
    <div className="px-2 pb-3">
      {!customersLoader.fetchAllCorporateCustomers && (
        <CorporateCustomersTable />
      )}
      {customersLoader.fetchAllCorporateCustomers && (
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
  fetchCorporateCustomers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(Dashboard);
