import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';

export const actions = {
  updateVehicleLoader: payload => dispatch =>
    dispatch({
      type: types.UPDATE_VEHICLE_LOADER,
      payload,
    }),
  updateSelectedVehicle: payload => dispatch =>
    dispatch({
      type: types.UPDATE_SELECTED_VEHICLE,
      payload,
    }),
  populateVehicles: payload => dispatch =>
    dispatch({
      type: types.POPULATE_VEHICLES,
      payload,
    }),
  fetchVehicle: payload => dispatch => {
    dispatch(
      actions.updateVehicleLoader({
        fetchVehicle: true,
      }),
    );
    return Api.fetch(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedVehicle(
            utils.camelizeKeys({
              ...data.data,
            }),
          ),
        );
        dispatch(
          actions.updateVehicleLoader({
            fetchVehicle: false,
          }),
        );
      })
      .catch(() => {
        dispatch(actions.updateSelectedVehicle({ empty: true }));
        dispatch(
          actions.updateVehicleLoader({
            fetchVehicle: false,
          }),
        );
      });
  },
};

export default actions;
