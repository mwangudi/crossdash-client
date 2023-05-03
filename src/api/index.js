import apiWrapper from 'api/wrapper';
import { isEmpty } from 'lodash';
import { computeApiSearchQuery, computeApiParentScope } from '../utils';

class Api {
  static signin(payload) {
    const url = '/oauth/token';
    return apiWrapper('post', url, payload);
  }

  static create({ scope, query, data }) {
    const url = isEmpty(query)
      ? `${scope}`
      : `${scope}?${computeApiSearchQuery(query)}`;
    return apiWrapper('post', url, data);
  }

  static upload({ scope, query, data }) {
    const url = `${scope}?${computeApiSearchQuery(query)}`;
    return apiWrapper('post', url, data);
  }

  static uploadWithUpdate({ scope, fingerprint, data }) {
    const url = isEmpty(fingerprint) ? `${scope}` : `${scope}/${fingerprint}`;
    return apiWrapper('put', url, data);
  }

  static createWithQuery({ payload, data }) {
    const url = `${payload.scope}?${computeApiSearchQuery(payload.query)}`;
    return apiWrapper('post', url, data);
  }

  static fetch({ scope, fingerprint, ...data }) {
    const url = isEmpty(fingerprint) ? `${scope}` : `${scope}/${fingerprint}`;
    return apiWrapper('get', url, data);
  }

  static fetchAll(payload) {
    const url = `${computeApiParentScope(payload) +
      payload.scope}?${computeApiSearchQuery(payload.query)}`;
    return apiWrapper('get', url, payload);
  }

  static put({ scope, fingerprint, data }) {
    const url = isEmpty(fingerprint) ? `${scope}` : `${scope}/${fingerprint}`;
    return apiWrapper('put', url, data);
  }
}

export default Api;
