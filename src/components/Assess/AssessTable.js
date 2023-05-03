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
import { useHistory, useLocation } from 'react-router-dom';

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

const AssessmentsTicketTable = props => {
  const {
    assess: {
      assessments,
      assessmentPaginationLinks: { self, first, last },
      assessmentPagination: { pageNumber, pageSize },
    },
    auth: { authRoles },
    updateAssessmentPagination,
    updateAssessmentModal,
    updateSelectedAssessment,
  } = props;
  const history = useHistory();
  const { pathname } = useLocation();

  const updateRowsPerPage = row =>
    updateAssessmentPagination({
      pageSize: row,
    });

  const updateCurrentPage = page =>
    updateAssessmentPagination({
      pageNumber: page,
    });

  const checkRole = r => authRoles.includes(r);

  const rowLabels = checkRole('assessor')
    ? ['Customer & Claim Ref.No', 'Assigner', 'Priority', 'Status & Aging', '']
    : [
        'Customer & Claim Ref.No',
        'Assessor',
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

  const isAdmin = () => {
    let value = true;
    if (!checkRole('admin') && !checkRole('manager')) {
      value = false;
    }

    return value;
  };

  const handleReassignModal = assessment => () => {
    updateSelectedAssessment({ ...assessment });
    updateAssessmentModal({
      openReassignAssessor: true,
    });
  };

  const handleViewTicket = assessment => () => {
    if (pathname.includes('/approval-queue')) {
      history.push(`/approval-queue/tickets/${assessment.id}`);
    } else {
      history.push(`/assessment-queue/tickets/${assessment.id}`);
    }
  };

  return (
    <>
      {!isEmpty(assessments) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {assessments.map(assessment => {
              const {
                id,
                attributes: {
                  assigner,
                  assessor,
                  aged,
                  priority,
                  status,
                  claim,
                },
              } = assessment;
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
                  {!checkRole('assessor') && (
                    <TableCell component="th" scope="row">
                      <span className="text-capitalize"> {assessor}</span>
                    </TableCell>
                  )}
                  <TableCell component="th" scope="row">
                    <div className="d-flex flex-column align-items-left">
                      <span className="text-capitalize">{assigner}</span>
                    </div>
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
                        <span>
                          <IconButton
                            className="py-0"
                            color="primary"
                            aria-label="view ticket"
                            onClick={handleViewTicket(assessment)}
                          >
                            <Icon icon={icVisible} size={25}></Icon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      {isAdmin() && (
                        <>
                          {isEqual('ready for approval', status) ? null : (
                            <Button
                              color="secondary"
                              onClick={handleReassignModal(assessment)}
                            >
                              <span className="text-capitalize">
                                Reassign Assessor
                              </span>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </CustomTable>
        </Div>
      )}
      {isEmpty(assessments) && (
        <div className="py-3">
          <p className="text-center">
            No tickets found in assessment, add more?
          </p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    assess: state.assess,
    auth: state.auth,
  };
}

AssessmentsTicketTable.propTypes = {
  assess: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateAssessmentPagination: PropTypes.func.isRequired,
  updateAssessmentModal: PropTypes.func.isRequired,
  updateSelectedAssessment: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(AssessmentsTicketTable);
