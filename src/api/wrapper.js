import axios from 'axios';
import { toLower } from 'lodash';

import { history } from 'store';

export default (method, url, data = {}) => {
  const accessToken = localStorage.getItem('crossdash:access_token');
  const baseOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: 'json',
    crossdomain: true,
    // Provide default baseURL so that zeit now can work properly
    url: `${process.env.REACT_APP_API_LOCATION ||
      'https://crossdash-claims-api.herokuapp.com'}${url}`,
    method,
    data,
  };

  const requestInterceptor = config => {
    return {
      ...baseOptions,
      ...config,
      headers: {
        ...baseOptions.headers,
        ...config.headers,
      },
    };
  };
  const responseInterceptor = res => res;
  const handleRequestError = error => {
    const { response } = JSON.parse(JSON.stringify(error));
    switch (true) {
      case response.status === 401:
        history.push({ pathname: '/logout' });
        return response;
      default:
        return response;
    }
  };

  const api = axios.create();
  api.interceptors.request.use(requestInterceptor, handleRequestError);
  api.interceptors.response.use(responseInterceptor, handleRequestError);

  return Promise.resolve(true)
    .then(() => api({ ...baseOptions }))
    .then(response => {
      switch (toLower(response.statusText)) {
        case 'ok':
        case 'created':
          return response;
        default:
          return Promise.reject(response);
      }
    });
};
