import React from 'react';
import styled from 'styled-components';
import {
  TableContainer,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import TablePagination from './TablePagination';

const StyledTable = styled(TableContainer)`
  .MuiTableRow-root.MuiTableRow-head {
    .MuiTableCell-head {
      // font-size: 1rem;
      color: ${({ theme }) => theme.palette.grey[700]};
      font-weight: 600;
    }
  }
  .MuiTableCell-root {
    cursor: pointer;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.grey[700]};
  }
`;

const CustomTable = props => {
  const { rowLabels, children, paginationProps, showPagination } = props;

  return (
    <>
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              {rowLabels.map((rowLabel, i) => (
                <TableCell key={i} align="left">
                  {rowLabel}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </StyledTable>
      {showPagination ? (
        <TablePagination paginationProps={paginationProps} />
      ) : (
        <div className="py-4" />
      )}
    </>
  );
};

CustomTable.propTypes = {
  rowLabels: PropTypes.array.isRequired,
  children: PropTypes.any.isRequired,
  paginationProps: PropTypes.object,
  showPagination: PropTypes.bool,
};

CustomTable.defaultProps = {
  paginationProps: {},
  showPagination: true,
};

export default CustomTable;
