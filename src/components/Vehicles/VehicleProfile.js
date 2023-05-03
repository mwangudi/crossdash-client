import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { isEmpty, isNil, isEqual } from 'lodash';
import Image from 'material-ui-image';
import { Icon } from 'react-icons-kit';
import { ic_directions_car as icCar } from 'react-icons-kit/md/ic_directions_car';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { ic_expand_less as icLess } from 'react-icons-kit/md/ic_expand_less';
import { ic_expand_more as icMore } from 'react-icons-kit/md/ic_expand_more';

import actions from '../../store/rootActions';
import DataContainer from '../Shared/DataContainer';
import VehicleDetails from './VehicleDetails';

const Wrapper = styled.div`
  .vehicle-profile {
    width: 100%;
    height: auto;
  }

  .vehicle-list {
    background-color: ${props => props.theme.palette.background.paper};
    max-height: 70vh;
    overflow-y: auto;
  }
`;

const VehicleProfile = props => {
  const {
    auth: { authRoles },
    customer: { selectedCustomer },
    vehicle: { vehicleLoader, selectedVehicle },
    fetchVehicle,
  } = props;
  const history = useHistory();
  const [showMore, setShowMore] = React.useState(false);

  React.useEffect(() => {
    const fetchVehicleAsync = async () => {
      if (
        selectedCustomer.attributes &&
        !isEmpty(selectedCustomer.attributes.vehicles)
      ) {
        await fetchVehicle({
          scope: '/vehicles',
          fingerprint: selectedCustomer.attributes.vehicles[0].id,
        });
      }
    };

    fetchVehicleAsync();
  }, [selectedCustomer, fetchVehicle]);

  const isRole = role => authRoles.includes(role);
  const handleSelectVehicle = vehicle => async () => {
    await fetchVehicle({
      scope: '/vehicles',
      fingerprint: vehicle.id,
    });
  };

  const goTo = path => history.push(path);
  const handleFileClaim = () => goTo('/new-claim');
  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <Wrapper className="row">
      {isEmpty(selectedCustomer) && (
        <div className="col-12 p-5">
          <Typography variant="body1" className="mb-2">
            No vehicles found.
          </Typography>
        </div>
      )}
      {!isEmpty(selectedCustomer) && (
        <>
          <div className="col-md-9 col-12">
            {vehicleLoader.fetchVehicle && (
              <div className="py-5 w-100 d-flex flex-row justify-content-center">
                <CircularProgress size={30} />
              </div>
            )}
            {!vehicleLoader.fetchVehicle && !isNil(selectedVehicle.attributes) && (
              <Paper>
                <div className="row p-2">
                  <div className="col-md-8 col-sm-10">
                    <div className="vehicle-profile w-100">
                      <Image
                        aspectRatio={16 / 9}
                        src={
                          selectedVehicle.attributes.vehiclePhotos.url ||
                          'http://lorempixel.com/g/400/200/abstract/Missing vehicle photos'
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12 py-2">
                    <Button
                      variant="contained"
                      color="primary"
                      className="s-button-claim py-2 mb-2"
                      onClick={handleFileClaim}
                    >
                      File claim
                    </Button>
                    {isRole('customer') && (
                      <DataContainer
                        label="Registration number"
                        value={selectedVehicle.attributes.registrationNumber}
                      />
                    )}
                    <DataContainer
                      label="Type"
                      value={
                        selectedVehicle.relationships.vehicleBodyType.data.name
                      }
                    />
                    <DataContainer
                      label="Manufacturer"
                      value={
                        selectedVehicle.relationships.vehicleModel.data
                          .vehicleManufacturer
                      }
                    />
                    <Button onClick={toggleShowMore}>
                      <div className="d-flex flex-row align-items-center">
                        <Icon size={26} icon={showMore ? icLess : icMore} />
                        <span className="pr-1 text-500 text-mini text-capitalize">
                          View {showMore ? 'less' : 'more'} info.
                        </span>
                      </div>
                    </Button>
                  </div>
                  {showMore && (
                    <div className="col-12 py-2">
                      <VehicleDetails vehicle={selectedVehicle} />
                    </div>
                  )}
                </div>
              </Paper>
            )}
          </div>
          <div className="col-md-3 col-10">
            <Typography variant="body1" className="mb-2">
              Vehicles
            </Typography>
            <div className="vehicle-list px-1 pb-3">
              <List dense>
                {selectedCustomer.attributes &&
                  selectedCustomer.attributes.vehicles.map(v => (
                    <ListItem
                      button
                      selected={isEqual(v.id, selectedVehicle.id)}
                      key={v.id}
                      onClick={handleSelectVehicle(v)}
                    >
                      <ListItemIcon>
                        <Icon icon={icCar} />
                      </ListItemIcon>
                      <ListItemText primary={v.registrationNumber} />
                    </ListItem>
                  ))}
              </List>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
};

VehicleProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  fetchVehicle: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    vehicle: state.vehicle,
    customer: state.customer,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(VehicleProfile);
