import React from 'react';
import { Typography } from '@material-ui/core';

import VehicleProfile from './VehicleProfile';

const CustomerView = () => {
  return (
    <div className="container">
      <div className="col-12">
        <Typography variant="h6" className="mt-2 mb-3">
          Vehicle Profile
        </Typography>
      </div>
      <VehicleProfile />
    </div>
  );
};

export default CustomerView;
