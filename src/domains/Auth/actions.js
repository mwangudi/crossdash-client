import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';
import { history } from '../../store';

export const actions = {
  updateAuthLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_AUTH_LOADER,
      payload,
    });
  },
  updateLoginForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_LOGIN_FORM,
      payload,
    });
  },
  updateLoginFormErrors: payload => dispatch => {
    dispatch({
      type: types.UPDATE_LOGIN_FORM_ERRORS,
      payload,
    });
  },
  signin: payload => dispatch => {
    dispatch(
      actions.updateAuthLoader({
        submit: true,
      }),
    );
    dispatch(actions.updateLoginFormErrors({ empty: true }));
    return Api.signin(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch({
          type: types.AUTHENTICATE,
          payload: {
            ...utils.camelizeKeys(data),
          },
        });
        dispatch(
          actions.updateAuthLoader({
            submit: false,
          }),
        );
        history.push({
          pathname: '/dashboard',
        });
      })
      .catch(({ data }) => {
        dispatch(actions.updateLoginFormErrors({ message: data.message }));
        dispatch(
          actions.updateAuthLoader({
            submit: false,
          }),
        );
      });
  },
  logout: () => dispatch => {
    dispatch({
      type: types.IN_AUTHENTICATE,
    });
  },
};

export default actions;
