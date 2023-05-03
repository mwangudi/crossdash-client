import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';

export const actions = {
  updateCustomersLoader: payload => dispatch =>
    dispatch({
      type: types.UPDATE_CUSTOMERS_LOADER,
      payload,
    }),
  populateCustomers: payload => dispatch =>
    dispatch({
      type: types.POPULATE_CUSTOMERS,
      payload,
    }),
  updateSelectedCustomer: payload => dispatch =>
    dispatch({
      type: types.UPDATE_SELECTED_CUSTOMER,
      payload,
    }),
  updateCustomerPaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CUSTOMER_PAGINATION_LINKS,
      payload,
    });
  },
  updateCustomerPagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CUSTOMER_PAGINATION,
      payload,
    });
  },
  toggleCustomerType: payload => dispatch => {
    dispatch({
      type: types.TOGGLE_CUSTOMER_TYPE,
      payload,
    });
  },
  fetchCustomers: payload => dispatch => {
    dispatch(actions.updateCustomersLoader({ fetchAllCustomers: true }));
    dispatch(actions.populateCustomers({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(
          actions.populateCustomers(
            utils.camelizeKeys({ customers: data.data }),
          ),
        );
        dispatch(
          actions.updateCustomerPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateCustomersLoader({ fetchAllCustomers: false }));
      })
      .catch(() => {
        dispatch(actions.populateCustomers({ empty: true }));
        dispatch(actions.updateCustomersLoader({ fetchAllCustomers: false }));
      });
  },
  fetchCustomer: payload => dispatch => {
    dispatch(
      actions.updateCustomersLoader({
        fetchCustomer: true,
      }),
    );
    dispatch(
      actions.updateSelectedCustomer({
        empty: true,
      }),
    );
    return Api.fetch(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedCustomer(
            utils.camelizeKeys({
              ...data.data,
            }),
          ),
        );
        dispatch(
          actions.updateCustomersLoader({
            fetchCustomer: false,
          }),
        );
      })
      .catch(() => {
        dispatch(
          actions.updateCustomersLoader({
            fetchCustomer: false,
          }),
        );
      });
  },
  searchCustomers: payload => dispatch => {
    dispatch(actions.updateCustomersLoader({ fetchAllCustomers: true }));
    dispatch(actions.populateCustomers({ empty: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.populateCustomers(
            utils.camelizeKeys({ customers: data.data }),
          ),
        );
        dispatch(
          actions.updateCustomerPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateCustomersLoader({ fetchAllCustomers: false }));
      })
      .catch(() => {
        dispatch(actions.populateCustomers({ empty: true }));
        dispatch(actions.updateCustomersLoader({ fetchAllCustomers: false }));
      });
  },
};

export default actions;
