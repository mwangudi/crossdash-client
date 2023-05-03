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

const ClaimViewPassengers = props => {
  const { passengers, showSensitiveInfo } = props;

  const rowLabels = ['Name', 'Gender', 'Age 18+', 'Phone', 'Address'];

  return (
    <Div className="px-3 w-100">
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        {passengers.map(p => (
          <TableRow key={p.id}>
            <TableCell>
              <div className="py-2">{p.name || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{p.gender || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{p.isAdult ? 'Yes' : 'No'}</div>
            </TableCell>
            <TableCell>{showSensitiveInfo() ? p.phoneNumber : ''}</TableCell>
            <TableCell>{showSensitiveInfo() ? p.address : ''}</TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </Div>
  );
};

ClaimViewPassengers.propTypes = {
  passengers: PropTypes.array.isRequired,

  showSensitiveInfo: PropTypes.func.isRequired,
};

export default ClaimViewPassengers;
