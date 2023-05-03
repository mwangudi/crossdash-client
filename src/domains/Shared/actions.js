import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';

export const actions = {
  updateDocumentTitle: payload => dispatch => {
    dispatch({
      type: types.UPDATE_DOCUMENT_TITLE,
      payload,
    });
  },
  updateDocumentRoute: payload => dispatch => {
    dispatch({
      type: types.UPDATE_DOCUMENT_ROUTE,
      payload,
    });
  },
  populateIdentityTypes: payload => dispatch => {
    dispatch({
      type: types.POPULATE_IDENTITY_TYPES,
      payload,
    });
  },
  updateSharedLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SHARED_LOADER,
      payload,
    });
  },
  toggleSidebar: payload => dispatch => {
    dispatch({
      type: types.TOGGLE_SIDEBAR_MENU,
      payload,
    });
  },
  fetchIdentityTypes: payload => dispatch => {
    dispatch(actions.updateSharedLoader({ fetchAll: true }));
    return Api.fetchAll(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(actions.populateIdentityTypes(data.data));
        dispatch(actions.updateSharedLoader({ fetchAll: false }));
      })
      .catch(() => {
        dispatch(actions.updateSharedLoader({ fetchAll: false }));
      });
  },
};

export default actions;
