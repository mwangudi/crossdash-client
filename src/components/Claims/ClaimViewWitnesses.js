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

const ClaimViewWitnesses = props => {
  const { witnesses, showSensitiveInfo } = props;

  const rowLabels = ['Name', 'Gender', 'Age 18+', 'Phone', 'Address'];

  return (
    <Div className="px-3 w-100">
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        {witnesses.map(w => (
          <TableRow key={w.id}>
            <TableCell>
              <div className="py-2">{w.name || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{w.gender || ''}</div>
            </TableCell>
            <TableCell>
              <div className="py-2">{w.isAdult ? 'Yes' : 'No'}</div>
            </TableCell>
            <TableCell>{showSensitiveInfo() ? w.phoneNumber : ''}</TableCell>
            <TableCell>{showSensitiveInfo() ? w.address : ''}</TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </Div>
  );
};

ClaimViewWitnesses.propTypes = {
  witnesses: PropTypes.array.isRequired,

  showSensitiveInfo: PropTypes.func.isRequired,
};

export default ClaimViewWitnesses;
