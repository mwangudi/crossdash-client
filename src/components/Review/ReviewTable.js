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

const ReviewsTicketTable = props => {
  const {
    review: {
      reviews,
      reviewPaginationLinks: { self, first, last },
      reviewPagination: { pageNumber, pageSize },
    },
    auth: { authRoles },
    updateReviewPagination,
    updateReviewModal,
    updateSelectedReview,
  } = props;
  const history = useHistory();

  const updateRowsPerPage = row =>
    updateReviewPagination({
      pageSize: row,
    });

  const updateCurrentPage = page =>
    updateReviewPagination({
      pageNumber: page,
    });

  const checkRole = r => authRoles.includes(r);

  const rowLabels = checkRole('reviewer')
    ? ['Customer & Claim Ref.No', 'Assigner', 'Priority', 'Status & Aging', '']
    : [
        'Customer & Claim Ref.No',
        'Reviewer',
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

  const handleReassignModal = review => () => {
    updateSelectedReview({ ...review });
    updateReviewModal({
      openReassignReviewer: true,
    });
  };

  const handleAssignModal = review => () => {
    updateSelectedReview({ ...review });
    updateReviewModal({
      openAssignAssessor: true,
    });
  };

  const handleViewTicket = review => () => {
    history.push(`/review-queue/tickets/${review.id}`);
  };

  return (
    <>
      {!isEmpty(reviews) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {reviews.map(review => {
              const {
                id,
                attributes: {
                  assigner,
                  reviewer,
                  aged,
                  priority,
                  status,
                  claim,
                },
              } = review;
              return (
                <TableRow key={id}>
                  <TableCell scope="row">
                    <div className="d-flex flex-column align-items-left">
                      <span className="text-capitalize mb-2">
                        {claim.customer.name} {claim.customer.tradeName}
                      </span>
                      <span className="text-uppercase mb-2">
                        {claim.referenceNumber}
                      </span>
                    </div>
                  </TableCell>
                  {!checkRole('reviewer') && (
                    <TableCell component="th" scope="row">
                      <span className="text-capitalize"> {reviewer}</span>
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
                        arrow
                      >
                        <span>
                          <IconButton
                            className="py-0"
                            color="primary"
                            aria-label="view ticket"
                            onClick={handleViewTicket(review)}
                          >
                            <Icon icon={icVisible} size={25}></Icon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      {isAdmin() && (
                        <>
                          {isEqual('ready for assessment', status) ? (
                            <Button
                              color="secondary"
                              onClick={handleAssignModal(review)}
                            >
                              <span className="text-capitalize">
                                Assign Assessor
                              </span>
                            </Button>
                          ) : (
                            <Button
                              color="secondary"
                              onClick={handleReassignModal(review)}
                            >
                              <span className="text-capitalize">
                                Reassign Reviewer
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
      {isEmpty(reviews) && (
        <div className="py-3">
          <p className="text-center">No tickets found in review, add more?</p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    review: state.review,
    auth: state.auth,
  };
}

ReviewsTicketTable.propTypes = {
  review: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateReviewPagination: PropTypes.func.isRequired,
  updateReviewModal: PropTypes.func.isRequired,
  updateSelectedReview: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(ReviewsTicketTable);
