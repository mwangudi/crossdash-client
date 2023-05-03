import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  colors,
  IconButton,
  Tooltip,
  Zoom,
  Chip,
  Button,
} from '@material-ui/core';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { ic_visibility as icVisible } from 'react-icons-kit/md/ic_visibility';
import { useHistory } from 'react-router-dom';

import actions from '../../store/rootActions';
import CustomTable from '../Shared/Table';
import StatusChip from '../Shared/StatusChip';

const Div = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};

  .title {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.grey[700]};
    font-weight: 600;
  }

  .policy-expired {
    color: ${colors.red[400]};
  }
`;

const SChip = styled(Chip)`
  &.top-priority {
    background-color: #ef5350;
  }
  background-color: #757575;
  color: #fff;
`;

const FinanceTicketTable = props => {
  const {
    finance: {
      finances,
      financePaginationLinks: { self, first, last },
      financePagination: { pageNumber, pageSize },
    },
    auth: { authRoles },
    updateFinancePagination,
    updateSelectedFinance,
    updateFinanceModal,
  } = props;
  const history = useHistory();

  const updateRowsPerPage = row =>
    updateFinancePagination({
      pageSize: row,
    });

  const updateCurrentPage = page =>
    updateFinancePagination({
      pageNumber: page,
    });

  const viewTicket = finance => () => {
    history.push(`/finance-queue/tickets/${finance.id}`);
  };

  const handleAssignFinance = f => () => {
    updateSelectedFinance(f);
    updateFinanceModal({
      openReassignFinance: true,
    });
  };

  const checkRole = r => authRoles.includes(r);

  const isAdminOrFinance = checkRole('admin') || checkRole('manager');

  const isPaid = status => isEqual(status, 'paid');

  const canAssignFinance = status => {
    return isAdminOrFinance && !isPaid(status);
  };

  const rowLabels = checkRole('finance')
    ? ['Customer & Claim Ref.No', 'Assigner', 'Priority', 'Status & Aging', '']
    : [
        'Customer & Claim Ref.No',
        'Finance',
        'Assigner',
        'Priority',
        'Status & Aging',
        '',
      ];

  const paginationProps = {
    selectedRowPerPage: pageSize,
    updateRowsPerPage,
    hasNext: !isEqual(self, last),
    hasPrevious: !isEqual(self, first),
    currentPage: pageNumber,
    updateCurrentPage,
  };

  return (
    <>
      {!isEmpty(finances) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {finances.map(f => {
              const {
                id,
                attributes: {
                  finance,
                  assigner,
                  aged,
                  priority,
                  status,
                  claim,
                },
              } = f;
              return (
                <TableRow key={id}>
                  <TableCell scope="row">
                    <div className="d-flex flex-column align-items-left">
                      <span className="text-capitalize mb-2">
                        {' '}
                        {claim.customer.name} {claim.customer.tradeName}
                      </span>
                      <span className="text-uppercase mb-2">
                        {claim.referenceNumber}
                      </span>
                    </div>
                  </TableCell>
                  {!checkRole('finance') && (
                    <TableCell component="th" scope="row">
                      <span className="text-capitalize"> {finance}</span>
                    </TableCell>
                  )}
                  <TableCell component="th" scope="row">
                    <span className="text-capitalize">{assigner}</span>
                  </TableCell>
                  <TableCell align="left">
                    <SChip
                      className={`text-capitalize ${
                        priority ? 'top-priority' : ''
                      }`}
                      label={priority ? 'high' : 'normal'}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className="d-flex flex-column align-items-center">
                      <StatusChip className="text-capitalize" status={status} />
                      <span className="text-capitalize mt-3">{aged}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="d-flex flex-column align-items-center">
                      <Tooltip
                        placement="top"
                        TransitionComponent={Zoom}
                        title="View ticket"
                      >
                        <IconButton
                          color="primary"
                          aria-label="view ticket"
                          onClick={viewTicket(f)}
                        >
                          <Icon icon={icVisible} size={25}></Icon>
                        </IconButton>
                      </Tooltip>
                      {canAssignFinance(status) && (
                        <Button
                          color="secondary"
                          onClick={handleAssignFinance(f)}
                        >
                          <span className="text-capitalize">
                            Reassign Finance
                          </span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </CustomTable>
        </Div>
      )}
      {isEmpty(finances) && (
        <div className="py-3">
          <p className="text-center">No tickets found in finances, add more?</p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    finance: state.finance,
  };
}

FinanceTicketTable.propTypes = {
  auth: PropTypes.object.isRequired,
  finance: PropTypes.object.isRequired,
  updateFinancePagination: PropTypes.func.isRequired,
  updateSelectedFinance: PropTypes.func.isRequired,
  updateFinanceModal: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(FinanceTicketTable);
