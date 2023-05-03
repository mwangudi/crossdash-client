import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, isNil, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Zoom,
  CircularProgress,
} from '@material-ui/core';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { ic_directions_car as icCar } from 'react-icons-kit/md/ic_directions_car';
import { useHistory } from 'react-router-dom';

import actions from '../../store/rootActions';
import CustomTable from '../Shared/Table';

const Div = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};

  .title {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.grey[700]};
    font-weight: 600;
  }
`;

const CustomersTable = props => {
  const {
    customer: {
      customers,
      customersLoader,
      individualCustomerType,
      customersPagination: { pageNumber, pageSize },
      customerPaginationLinks: { self, first, last },
    },
    updateCustomerPagination,
    fetchCustomer,
  } = props;
  const history = useHistory();
  const goTo = path => history.push(path);
  const [selectedUserId, setSelectedUserId] = React.useState('');

  const updateRowsPerPage = row =>
    updateCustomerPagination({
      pageSize: row,
    });

  const updateCurrentPage = page =>
    updateCustomerPagination({
      pageNumber: page,
    });
  const rowLabels = individualCustomerType
    ? ['Full Name', 'Gender', '']
    : ['Legal Name', ''];

  const paginationProps = {
    selectedRowPerPage: pageSize,
    updateRowsPerPage,
    hasNext: !isEqual(self, last),
    hasPrevious: !isEqual(self, first),
    currentPage: pageNumber,
    updateCurrentPage,
  };

  const getUser = userId => async () => {
    const scope = individualCustomerType
      ? '/individual_customers'
      : '/corporate_customers';
    setSelectedUserId(userId);
    await fetchCustomer({
      scope,
      fingerprint: userId,
    });
    goTo('/customers/vehicles');
  };

  const splitNames = (name, firstName) => {
    if (!isNil(name)) {
      return name.split(' ')[0];
    }
    if (!isNil(firstName)) {
      return firstName;
    }
    return '';
  };

  return (
    <>
      {!isEmpty(customers) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {individualCustomerType &&
              customers.map(
                ({ id, attributes: { name, firstName, lastName, gender } }) => (
                  <TableRow key={id}>
                    <TableCell align="left">
                      <div className="d-flex flex-column align-items-left text-capitalize">
                        {name || `${firstName} ${lastName}`}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <span className="text-capitalize">{gender}</span>
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip
                        placement="top"
                        TransitionComponent={Zoom}
                        title={`View ${splitNames(name, firstName)}'s vehicles`}
                        arrow
                      >
                        <IconButton
                          color="primary"
                          aria-label="view vehicles"
                          onClick={getUser(id)}
                          disabled={customersLoader.fetchCustomer}
                        >
                          {(!customersLoader.fetchCustomer ||
                            !isEqual(selectedUserId, id)) && (
                            <Icon icon={icCar} size={24} />
                          )}
                          {customersLoader.fetchCustomer &&
                            isEqual(selectedUserId, id) && <CircularProgress />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ),
              )}
            {!individualCustomerType &&
              customers.map(({ id, attributes: { legalName } }) => (
                <TableRow key={id}>
                  <TableCell align="left">
                    <span className="text-capitalize">{legalName}</span>
                  </TableCell>
                  <TableCell align="left">
                    <Tooltip
                      placement="top"
                      TransitionComponent={Zoom}
                      title={`View ${legalName}'s vehicles`}
                      arrow
                    >
                      <IconButton
                        color="primary"
                        aria-label="view vehicles"
                        onClick={getUser(id)}
                        disabled={customersLoader.fetchCustomer}
                      >
                        {(!customersLoader.fetchCustomer ||
                          !isEqual(selectedUserId, id)) && (
                          <Icon icon={icCar} size={24} />
                        )}
                        {customersLoader.fetchCustomer &&
                          isEqual(selectedUserId, id) && <CircularProgress />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </CustomTable>
        </Div>
      )}
      {isEmpty(customers) && (
        <div className="py-5">
          <p className="text-center">No customers found!</p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    customer: state.customer,
  };
}

CustomersTable.propTypes = {
  customer: PropTypes.object.isRequired,
  updateCustomerPagination: PropTypes.func.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(CustomersTable);
