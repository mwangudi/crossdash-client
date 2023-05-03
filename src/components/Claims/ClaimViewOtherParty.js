import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import CustomTable from '../Shared/Table';

const Div = styled.div`
  .s-title {
    color: #424242;
  }
`;

const ClaimViewOtherParty = props => {
  const { otherParty, getIdentificationType, showSensitiveInfo } = props;

  const rowLabels = [
    'Name',
    'Identification',
    'Vehicle Reg.No',
    'Insurance',
    'Damages',
  ];

  return (
    <Div className="px-3 w-100">
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        {otherParty.map(o => (
          <TableRow key={o.id}>
            <TableCell>
              <div className="py-2">{o.name || ''}</div>
            </TableCell>
            <TableCell>
              <div className="d-flex flex-column">
                <div>
                  {showSensitiveInfo()
                    ? getIdentificationType(o.identificationTypeId)
                    : ''}
                </div>
                <div>{showSensitiveInfo() ? o.identificationNumber : ''}</div>
              </div>
            </TableCell>
            <TableCell>
              {showSensitiveInfo() ? o.vehicleRegistrationNumber : ''}
            </TableCell>
            <TableCell>
              <div className="d-flex flex-column">
                <div>{o.insurer}</div>
                <div>{o.insurerPolicyNumber}</div>
              </div>
            </TableCell>
            <TableCell>
              {!isEmpty(o.vehicleDamages) ? (
                <div>{o.vehicleDamages.join(' ,')}</div>
              ) : (
                <div>Damages not listed.</div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </Div>
  );
};

ClaimViewOtherParty.propTypes = {
  otherParty: PropTypes.array.isRequired,
  getIdentificationType: PropTypes.func.isRequired,
  showSensitiveInfo: PropTypes.func.isRequired,
};

export default ClaimViewOtherParty;
