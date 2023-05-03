import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';
import styled from 'styled-components';

import CustomTable from '../Shared/Table';
import utils from '../../utils';

const Div = styled.div`
  .s-title {
    color: #424242;
  }
`;

const ClaimViewVehicleDamages = props => {
  const { vehicleDamages } = props;

  const rowLabels = ['Damages', 'Estimated repair cost', 'Repair details'];

  return (
    <Div className="px-3">
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        {vehicleDamages.map(v => (
          <TableRow key={v.id}>
            <TableCell>
              <div className="py-2">{v.damage || ''}</div>
            </TableCell>
            <TableCell>
              {utils.addCommasToNumbers(v.estimatedRepairCost) || ''}
            </TableCell>
            <TableCell>{v.repairDetails || ''}</TableCell>
          </TableRow>
        ))}
      </CustomTable>
      <div>
        <span className="text-500 s-title">
          Total cost{' '}
          {utils.addCommasToNumbers(
            vehicleDamages
              .map(v => v.estimatedRepairCost)
              .reduce((acc, currVal) => acc + currVal),
          )}
        </span>
      </div>
    </Div>
  );
};

ClaimViewVehicleDamages.propTypes = {
  vehicleDamages: PropTypes.array.isRequired,
};

export default ClaimViewVehicleDamages;
