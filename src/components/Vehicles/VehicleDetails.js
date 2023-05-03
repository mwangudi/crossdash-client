import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';

import CustomTable from '../Shared/Table';

const VehicleDetails = props => {
  const {
    vehicle: {
      attributes,
      relationships: { vehicleModel, vehicleUse },
    },
  } = props;

  const rowLabels = ['VIN', 'Model', 'Year', 'Use', 'Garage', 'Fuel', 'Color'];

  const rowLabels2 = [
    'Carrying capacity',
    'Cubic capacity',
    'Engine No.',
    'Tare Weight',
    'Modifications',
  ];

  return (
    <div>
      <CustomTable showPagination={false} rowLabels={rowLabels}>
        <TableRow>
          <TableCell>{attributes.vehicleIdentificationNumber || ''}</TableCell>
          <TableCell>{vehicleModel.data.name || ''}</TableCell>
          <TableCell>{vehicleModel.data.yearOfManufacture || ''}</TableCell>
          <TableCell>{vehicleUse.data.use || ''}</TableCell>
          <TableCell>{attributes.garageLocation || ''}</TableCell>
          <TableCell>{attributes.fuelType || ''}</TableCell>
          <TableCell>{attributes.colour || ''}</TableCell>
        </TableRow>
      </CustomTable>
      <div className="py-2" />
      <CustomTable showPagination={false} rowLabels={rowLabels2}>
        <TableRow>
          <TableCell>{attributes.carryingCapacity || ''}</TableCell>
          <TableCell>{attributes.cubicCapacity || ''}</TableCell>
          <TableCell>{attributes.engineNumber || ''}</TableCell>
          <TableCell>{attributes.tareWeight || ''}</TableCell>
          <TableCell>
            <div className="d-flex flex-column align-items-center">
              <span>{attributes.isModified ? 'Modified' : 'Not modified'}</span>
              {attributes.isModified && <p>{attributes.modificationDetails}</p>}
            </div>
          </TableCell>
        </TableRow>
      </CustomTable>
    </div>
  );
};

VehicleDetails.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default VehicleDetails;
