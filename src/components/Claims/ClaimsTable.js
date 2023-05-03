import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, isEqual, isNil } from 'lodash';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  colors,
  IconButton,
  Tooltip,
  Zoom,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { ic_visibility as icVisible } from 'react-icons-kit/md/ic_visibility';
import Image from 'material-ui-image';
import { useHistory } from 'react-router-dom';

import actions from '../../store/rootActions';
import CustomTable from '../Shared/Table';
import utils from '../../utils';
import StatusChip from '../Shared/StatusChip';
import { Hooks } from '../../utils/reactHooks';

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

  .vehicle-photo {
    height: 60px;
    width: 100px;
  }
`;

const ClaimsTable = props => {
  const {
    claim: {
      claims,
      claimPaginationLinks: { self, first, last },
      claimsPagination: { pageNumber, pageSize },
      claimsLoader,
    },
    auth: { authRoles },
    updateClaimPagination,
    updateSelectedClaim,
    handleOpenModal,
    fetchClaim,
  } = props;
  const history = useHistory();
  const { checkRole } = Hooks();

  const updateRowsPerPage = row =>
    updateClaimPagination({
      pageSize: row,
    });

  const updateCurrentPage = page =>
    updateClaimPagination({
      pageNumber: page,
    });

  const rowLabels = [
    'Customer & Ref.No',
    'Policy Cover,Number & Expiry',
    'Vehicle',
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

  const canAssignClaim = currentStatus => {
    let assignClaim = true;
    if (!authRoles.includes('admin') && !authRoles.includes('manager')) {
      assignClaim = false;
    }
    if (!isEqual(currentStatus, 'new')) {
      assignClaim = false;
    }
    return assignClaim;
  };

  const handleAssign = claim => () => {
    updateSelectedClaim(claim);
    handleOpenModal();
  };

  const handleViewClaim = claimId => () => {
    history.push(`/dashboard/claim/${claimId}`);
  };

  const showSensitiveInfo = () => {
    switch (true) {
      case checkRole('manager'):
      case checkRole('admin'):
        return true;
      default:
        return false;
    }
  };

  const viewClaim = claimId => async () => {
    await fetchClaim({
      scope: '/claims',
      fingerprint: claimId,
    });
    history.push('/update-claim');
  };

  return (
    <>
      {!isEmpty(claims) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <p className="title pl-3">Claims</p>

          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{ ...paginationProps }}
          >
            {claims.map(claim => {
              const {
                id,
                attributes: {
                  claimant,
                  vehicle: {
                    insurancePolicy,
                    registrationNumber,
                    vehicleModel,
                    vehiclePhotos,
                  },
                  currentStatus,
                  aged,
                  referenceNumber,
                },
              } = claim;
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    <div className="d-flex flex-column align-items-left">
                      {claimant.tradeName && (
                        <span className="mb-2">{claimant.tradeName}</span>
                      )}
                      {claimant.name && (
                        <span className="mb-2">{claimant.name}</span>
                      )}
                      {referenceNumber && (
                        <p className="mb-0 mt-3">{referenceNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className="d-flex flex-column align-items-left">
                      <span className="mb-2 text-capitalize">
                        {insurancePolicy.policyCover.name}
                      </span>
                      <span>{insurancePolicy.policyNumber}</span>
                      <p className="mt-2">
                        {utils.dateIsBefore({
                          dateToCheck: insurancePolicy.policyEndDate,
                          unit: 'w',
                        })
                          ? 'Expired '
                          : 'Expiry '}
                        <span>
                          {utils.timeAgo(insurancePolicy.policyEndDate)}
                        </span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="d-flex flex-row align-items-center">
                      {!isNil(vehiclePhotos.thumb.url) && (
                        <div className="pr-2 rounded vehicle-photo">
                          <Image
                            aspectRatio={16 / 9}
                            src={vehiclePhotos.thumb.url}
                          />
                        </div>
                      )}
                      <div className="d-flex flex-column align-items-left">
                        {showSensitiveInfo() && (
                          <p className="mb-1">{registrationNumber}</p>
                        )}
                        <p className="mb-0 text-uppercase">
                          {!isEmpty(vehicleModel) &&
                            `${vehicleModel.vehicleManufacturer} - ${vehicleModel.name}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="d-flex flex-column align-items-center">
                      <StatusChip
                        className="text-capitalize"
                        status={currentStatus}
                      />
                      <p className="mb-0 mt-2">{aged}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="d-flex flex-column align-items-center">
                      <Tooltip
                        placement="top"
                        TransitionComponent={Zoom}
                        title="View claim"
                        arrow
                      >
                        <span>
                          <IconButton
                            className="py-0"
                            color="primary"
                            aria-label="view claim"
                            onClick={handleViewClaim(id)}
                          >
                            <Icon icon={icVisible} size={25}></Icon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      {canAssignClaim(currentStatus) && (
                        <Button color="secondary" onClick={handleAssign(claim)}>
                          <span className="text-capitalize">
                            Assign Reviewer
                          </span>
                        </Button>
                      )}
                      {checkRole('customer') &&
                        isEqual(currentStatus, 'back to customer') && (
                          <Button>
                            {claimsLoader.fetch && <CircularProgress />}
                            {!claimsLoader.fetch && (
                              <Typography
                                variant="body2"
                                className="text-capitalize"
                                onClick={viewClaim(id)}
                              >
                                Update claim
                              </Typography>
                            )}
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
      {isEmpty(claims) && (
        <div className="py-3">
          <p className="text-center">No claims found!</p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
    auth: state.auth,
  };
}

ClaimsTable.propTypes = {
  claim: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateClaimPagination: PropTypes.func.isRequired,
  updateSelectedClaim: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  fetchClaim: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(ClaimsTable);