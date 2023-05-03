import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';
import * as approvalTypes from '../Approve/actionTypes';

export const actions = {
  updateFinanceLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_FINANCE_LOADER,
      payload,
    });
  },
  populateFinanciers: payload => dispatch => {
    dispatch({
      type: types.POPULATE_FINANCIERS,
      payload,
    });
  },
  populateFinances: payload => dispatch => {
    dispatch({
      type: types.POPULATE_FINANCES,
      payload,
    });
  },
  updateFinancePagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_FINANCE_PAGINATION,
      payload,
    });
  },
  updateFinancePaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_FINANCE_PAGINATION_LINKS,
      payload,
    });
  },
  updateSelectedFinance: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SELECTED_FINANCE,
      payload,
    });
  },
  updateFinanceModal: payload => dispatch => {
    dispatch({
      type: types.UPDATE_FINANCE_MODAL,
      payload,
    });
  },
  manageFinance: payload => dispatch => {
    dispatch({
      type: types.MANAGE_FINANCES,
      payload,
    });
  },
  updateFinanceTicketForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_FINANCE_TICKET_FORM,
      payload,
    });
  },
  fetchFinanciers: payload => dispatch => {
    dispatch(actions.updateFinanceLoader({ fetchAllFinanciers: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateFinanciers(utils.camelizeKeys(data.data)));
        dispatch(actions.updateFinanceLoader({ fetchAllFinanciers: false }));
      })
      .catch(() => {
        dispatch(actions.updateFinanceLoader({ fetchAllFinanciers: false }));
      });
  },
  fetchFinances: payload => dispatch => {
    dispatch(actions.updateFinanceLoader({ fetchAllFinances: true }));
    dispatch(actions.populateFinances({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateFinances(utils.camelizeKeys(data.data)));
        dispatch(
          actions.updateFinancePaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateFinanceLoader({ fetchAllFinances: false }));
      })
      .catch(() => {
        dispatch(actions.populateFinances({ empty: true }));
        dispatch(actions.updateFinanceLoader({ fetchAllFinances: false }));
      });
  },
  assignFinance: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateFinanceLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch({
          type: approvalTypes.MANAGE_APPROVALS,
          payload: {
            delete: true,
            ...utils.camelizeKeys(data.data),
          },
        });
        dispatch(actions.updateFinanceLoader({ submit: false }));
        completionHandler();
        notificationHandler('Ticket assigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateFinanceLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
  fetchSingleFinance: payload => dispatch => {
    dispatch(actions.updateFinanceLoader({ fetch: true }));
    return Api.fetch(payload)
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedFinance(utils.camelizeKeys({ ...data.data })),
        );
        dispatch(actions.updateFinanceLoader({ fetch: false }));
      })
      .catch(() => {
        dispatch(actions.updateFinanceLoader({ fetch: false }));
      });
  },
  updateFinance: payload => dispatch => {
    dispatch(actions.updateFinanceLoader({ update: true }));
    return Api.put(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateFinanceLoader({ update: false }));
      })
      .catch(() => {
        dispatch(actions.updateFinanceLoader({ update: false }));
      });
  },
  payClaim: (payload, notificationHandler, successHandler) => dispatch => {
    dispatch(actions.updateFinanceLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateFinanceLoader({ submit: false }));
        successHandler();
        notificationHandler('Processing complete', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateFinanceLoader({ submit: false }));
      });
  },
  reassignFinance: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateFinanceLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.manageFinance({
            update: true,
            ...utils.camelizeKeys(data.data),
          }),
        );
        dispatch(actions.updateFinanceLoader({ submit: false }));
        completionHandler();
        notificationHandler('Ticket assigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateFinanceLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
};

export default actions;
