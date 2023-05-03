import * as types from './actionTypes';

export const initialState = {
  adminLoader: {
    fetch: false,
    fetchAll: false,
    submit: false,
  },
  admins: [],
};

export const reducer = (state = initialState, action) => {
  let admins = [];
  switch (action.type) {
    case types.POPULATE_ADMINS:
      if (!action.payload.empty) {
        admins = [...action.payload];
      }
      return {
        ...state,
        admins,
      };
    case types.UPDATE_ADMIN_LOADER:
      return {
        ...state,
        adminLoader: {
          ...state.adminLoader,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
