import { isNil } from 'lodash';
import * as types from './actionTypes';

const emptyLoginForm = {
  email: '',
  password: '',
};

export const initialState = {
  authLoader: {
    submit: false,
  },
  loginForm: { ...emptyLoginForm },
  loginFormErrors: {},
  authUser: {},
  authAccessToken: '',
  authRefreshToken: '',
  isAuthenticated: false,
  authRoles: [],
};

export const reducer = (state = initialState, action) => {
  let loginForm = { ...emptyLoginForm };
  let loginFormErrors = {};
  let authAccessToken = '';
  let authRefreshToken = '';
  let authUser = {};
  let authRoles = [];

  switch (action.type) {
    case types.UPDATE_AUTH_LOADER: {
      return {
        ...state,
        authLoader: {
          ...state.authLoader,
          ...action.payload,
        },
      };
    }
    case types.UPDATE_LOGIN_FORM: {
      if (!action.payload.empty) {
        loginForm = {
          ...action.payload,
        };
      }
      return {
        ...state,
        loginForm,
      };
    }
    case types.UPDATE_LOGIN_FORM_ERRORS: {
      if (!action.payload.empty) {
        loginFormErrors = {
          ...action.payload,
        };
      }
      return {
        ...state,
        loginFormErrors,
      };
    }
    case types.AUTHENTICATE:
      const {
        payload: {
          roles,
          user,
          customer,
          accessToken,
          refreshToken,
          expiresIn,
          createdAt,
        },
      } = action;
      authAccessToken = accessToken;
      authRefreshToken = refreshToken;
      authRoles = roles;
      authUser = !isNil(customer)
        ? { ...user, roles, expiresIn, createdAt, customer: { ...customer } }
        : { ...user, roles, expiresIn, createdAt };
      localStorage.setItem('crossdash:access_token', accessToken);
      return {
        ...state,
        authUser,
        authRoles,
        authAccessToken,
        authRefreshToken,
        isAuthenticated: true,
      };
    case types.IN_AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: false,
        authRefreshToken,
        authAccessToken,
        authRoles,
        authUser,
      };
    default:
      return state;
  }
};

export default reducer;
