import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';

export const actions = {
  updateApprovalLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_APPROVAL_LOADER,
      payload,
    });
  },
  populateApprovers: payload => dispatch => {
    dispatch({
      type: types.POPULATE_APPROVERS,
      payload,
    });
  },
  populateApprovals: payload => dispatch => {
    dispatch({
      type: types.POPULATE_APPROVALS,
      payload,
    });
  },
  updateApprovalPagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_APPROVAL_PAGINATION,
      payload,
    });
  },
  updateApprovalPaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_APPROVAL_PAGINATION_LINKS,
      payload,
    });
  },
  updateSelectedApproval: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SELECTED_APPROVAL,
      payload,
    });
  },
  updateApprovalModal: payload => dispatch => {
    dispatch({
      type: types.UPDATE_APPROVAL_MODAL,
      payload,
    });
  },
  manageApproval: payload => dispatch => {
    dispatch({
      type: types.MANAGE_APPROVALS,
      payload,
    });
  },
  updateApprovalTicketForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_APPROVAL_TICKET_FORM,
      payload,
    });
  },
  fetchApprovers: payload => dispatch => {
    dispatch(actions.updateApprovalLoader({ fetchAll: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateApprovers(data.data));
        dispatch(actions.updateApprovalLoader({ fetchAll: false }));
      })
      .catch(() => {
        dispatch(actions.updateApprovalLoader({ fetchAll: false }));
      });
  },
  fetchApprovals: payload => dispatch => {
    dispatch(actions.updateApprovalLoader({ fetchAll: true }));
    dispatch(actions.populateApprovals({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(
          actions.populateApprovals(
            utils.camelizeKeys({ approvals: data.data }),
          ),
        );
        dispatch(
          actions.updateApprovalPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateApprovalLoader({ fetchAll: false }));
      })
      .catch(() => {
        dispatch(actions.populateApprovals({ empty: true }));
        dispatch(actions.updateApprovalLoader({ fetchAll: false }));
      });
  },
  fetchSingleApproval: payload => dispatch => {
    dispatch(actions.updateApprovalLoader({ fetch: true }));
    return Api.fetch(payload)
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedApproval(utils.camelizeKeys({ ...data.data })),
        );
        dispatch(actions.updateApprovalLoader({ fetch: false }));
      })
      .catch(() => {
        dispatch(actions.updateApprovalLoader({ fetch: false }));
      });
  },
  changeApprovalStatus: (
    payload,
    notificationHandler,
    successHandler,
  ) => dispatch => {
    dispatch(actions.updateApprovalLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateApprovalTicketForm({ empty: true }));
        dispatch(actions.updateApprovalLoader({ submit: false }));
        successHandler();
        notificationHandler('Processing complete', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateApprovalLoader({ submit: false }));
      });
  },
};

export default actions;
