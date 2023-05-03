import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';
import styled from 'styled-components';

import CustomTable from '../Shared/Table';

const Div = styled.div`
  .s-title {
    color: #424242;
  }
`;

const ClaimViewInjuredPerson = props => {
  const { injuredPersons, getIdentificationType, showSensitiveInfo } = props;

  const rowLabels = [
    'Name',
    'Gender',
    'Age 18+',
    'Identification',
    'Relation',
    'Vehicle',
  ];

  return (
    <Div className="px-3 w-100">
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        {injuredPersons.map(inj => (
          <TableRow key={inj.id}>
            <TableCell>
              <div className="py-2">{inj.name || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{inj.gender || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{inj.isAdult ? 'Yes' : 'No'}</div>
            </TableCell>
            <TableCell>
              <div className="d-flex flex-column">
                <div>
                  {showSensitiveInfo()
                    ? getIdentificationType(inj.identificationTypeId)
                    : ''}
                </div>
                <div>{showSensitiveInfo() ? inj.identificationNumber : ''}</div>
              </div>
            </TableCell>
            <TableCell>
              {showSensitiveInfo() ? inj.relationToClaimant : ''}
            </TableCell>
            <TableCell>
              <div className="d-flex flex-column">
                <div>
                  {inj.wasInAVehicle ? 'Was in vehicle' : `Wasn't in vehicle`}
                </div>
                <div>{inj.wasDriver ? 'Was the driver' : ''}</div>
                <div>
                  {inj.vehicleRegistrationNumber &&
                    showSensitiveInfo() &&
                    `Vehicle registration ${inj.vehicleRegistrationNumber ||
                      ''}`}
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </Div>
  );
};

ClaimViewInjuredPerson.propTypes = {
  injuredPersons: PropTypes.array.isRequired,
  getIdentificationType: PropTypes.func.isRequired,
  showSensitiveInfo: PropTypes.func.isRequired,
};

export default ClaimViewInjuredPerson;
