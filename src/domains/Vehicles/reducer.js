import * as types from './actionTypes';

export const initialState = {
  vehicleLoader: {
    fetchVehicle: false,
    fetchAllVehicle: false,
  },
  selectedVehicle: {},
  vehicles: [],
};

export const reducer = (state = initialState, action) => {
  let vehicles = [];
  let selectedVehicle = {};

  switch (action.type) {
    case types.UPDATE_VEHICLE_LOADER:
      return {
        ...state,
        vehicleLoader: {
          ...state.vehicleLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_VEHICLES: {
      if (!action.payload.empty) {
        vehicles = [...action.payload];
      }
      return {
        ...state,
        vehicles,
      };
    }
    case types.UPDATE_SELECTED_VEHICLE:
      if (!action.payload.empty) {
        selectedVehicle = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedVehicle,
      };
    default:
      return state;
  }
};

export default reducer;
