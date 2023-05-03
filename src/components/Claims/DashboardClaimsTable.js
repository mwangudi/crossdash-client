import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { TableRow, TableCell, colors } from '@material-ui/core';
import styled from 'styled-components';

import actions from '../../store/rootActions';
import CustomTable from '../Shared/Table';
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

const DashboardClaimsTable = props => {
  const {
    claim: { claims },
  } = props;
  const { checkRole } = Hooks();

  const rowLabels = ['Customer', 'Vehicle', 'Aging'];

  const showSensitiveInfo = () => {
    switch (true) {
      case checkRole('manager'):
      case checkRole('admin'):
        return true;
      default:
        return false;
    }
  };

  return (
    <>
      {!isEmpty(claims) && (
        <Div className="w-100 px-4 pt-5 pb-3 rounded">
          <p className="title pl-3">New claims</p>

          <CustomTable
            rowLabels={rowLabels}
            paginationProps={{}}
            showPagination={false}
          >
            {claims.map(claim => {
              const {
                id,
                attributes: {
                  claimant,
                  vehicle: { registrationNumber, vehicleModel },
                  aged,
                },
              } = claim;
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    <div className="d-flex flex-column align-items-left py-3">
                      {claimant.tradeName && (
                        <span className="mb-2">{claimant.tradeName}</span>
                      )}
                      {claimant.name && (
                        <span className="mb-2">{claimant.name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="d-flex flex-row align-items-center">
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
                    <p className="mb-0 mt-2">{aged}</p>
                  </TableCell>
                </TableRow>
              );
            })}
          </CustomTable>
        </Div>
      )}
      {isEmpty(claims) && (
        <div className="py-3">
          <p className="text-center">No new claims found!</p>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

DashboardClaimsTable.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(DashboardClaimsTable);
