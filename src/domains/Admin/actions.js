import * as types from './actionTypes';
import Api from '../../api';

export const actions = {
  populateAdmins: payload => dispatch => {
    dispatch({
      type: types.POPULATE_ADMINS,
      payload,
    });
  },
  updateAdminLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ADMIN_LOADER,
      payload,
    });
  },
  fetchAdmins: payload => dispatch => {
    dispatch(actions.updateAdminLoader({ fetchAll: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateAdmins(data.data));
        dispatch(actions.updateAdminLoader({ fetchAll: false }));
      })
      .catch(() => {
        dispatch(actions.updateAdminLoader({ fetchAll: false }));
      });
  },
};

export default actions;
