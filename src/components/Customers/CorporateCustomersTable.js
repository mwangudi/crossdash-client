import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
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
import canAssessorView from '../Claims/ClaimsTable';

const Div = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};

  .title {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.grey[700]};
    font-weight: 600;
  }
`;

const CorporateCustomersTable = props => {
  const {
    customer: {
      customersLoader,
      corporateCustomers,
      corporateCustomersPagination: { pageNumber, pageSize },
      corporateCustomerPaginationLinks: { self, first, last },
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

  const rowLabels = canAssessorView
    ? ['Legal Name', '']
    : ['Legal Name', 'Income Tax Number', ''];

  const paginationProps = {
    selectedRowPerPage: pageSize,
    updateRowsPerPage,
    hasNext: !isEqual(self, last),
    hasPrevious: !isEqual(self, first),
    currentPage: pageNumber,
    updateCurrentPage,
  };

  const getUser = userId => async () => {
    setSelectedUserId(userId);
    await fetchCustomer({
      scope: '/corporate_customers',
      fingerprint: userId,
    });
    goTo('/customers/vehicles');
  };

  return (
    <>
      {!isEmpty(corporateCustomers) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {corporateCustomers.map(
              ({ id, attributes: { legalName, incomeTaxNumber } }) => (
                <TableRow key={id}>
                  <TableCell align="left">
                    <span className="text-capitalize">{legalName}</span>
                  </TableCell>
                  {!canAssessorView && (
                    <TableCell align="left">{incomeTaxNumber}</TableCell>
                  )}
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
                        {!customersLoader.fetchCustomer && (
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
          </CustomTable>
        </Div>
      )}
      {isEmpty(corporateCustomers) && (
        <div className="py-5">
          <p className="text-center">No corporate customers found!</p>
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

CorporateCustomersTable.propTypes = {
  customer: PropTypes.object.isRequired,
  updateCustomerPagination: PropTypes.func.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(CorporateCustomersTable);
