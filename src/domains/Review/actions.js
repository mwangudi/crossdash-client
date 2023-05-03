import * as types from './actionTypes';
import * as claimTypes from '../Claims/actionTypes';
import Api from '../../api';
import utils from '../../utils';

export const actions = {
  populateReviewers: payload => dispatch => {
    dispatch({
      type: types.POPULATE_REVIEWERS,
      payload,
    });
  },
  populateReviews: payload => dispatch => {
    dispatch({
      type: types.POPULATE_REVIEWS,
      payload,
    });
  },
  updateReviewLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_REVIEW_LOADER,
      payload,
    });
  },
  updateReviewPaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_REVIEW_PAGINATION_LINKS,
      payload,
    });
  },
  updateReviewPagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_REVIEW_PAGINATION,
      payload,
    });
  },
  updateReviewModal: payload => dispatch => {
    dispatch({
      type: types.UPDATE_REVIEW_MODAL,
      payload,
    });
  },
  updateSelectedReview: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SELECTED_REVIEW,
      payload,
    });
  },
  manageReviews: payload => dispatch => {
    dispatch({
      type: types.MANAGE_REVIEWS,
      payload,
    });
  },
  updateReviewTicketForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_REVIEW_TICKET_FORM,
      payload,
    });
  },
  fetchReviewers: payload => dispatch => {
    dispatch(actions.updateReviewLoader({ fetchAllReviewers: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateReviewers(data.data));
        dispatch(actions.updateReviewLoader({ fetchAllReviewers: false }));
      })
      .catch(() => {
        dispatch(actions.updateReviewLoader({ fetchAllReviewers: false }));
      });
  },
  assignReviewer: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateReviewLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(() => {
        const {
          data: { claimId },
        } = payload;
        dispatch({
          type: claimTypes.MANAGE_CLAIMS,
          payload: {
            id: claimId,
          },
        });
        dispatch(actions.updateReviewLoader({ submit: false }));
        completionHandler();
        notificationHandler('Claim assigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateReviewLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
  reAssignReview: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateReviewLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.manageReviews({
            update: true,
            ...utils.camelizeKeys(data.data),
          }),
        );
        dispatch(actions.updateReviewLoader({ submit: false }));
        completionHandler();
        notificationHandler('Ticket reassigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateReviewLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
  fetchReviews: payload => dispatch => {
    dispatch(actions.updateReviewLoader({ fetchAllReviews: true }));
    dispatch(actions.populateReviews({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(
          actions.populateReviews(utils.camelizeKeys({ reviews: data.data })),
        );
        dispatch(
          actions.updateReviewPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateReviewLoader({ fetchAllReviews: false }));
      })
      .catch(() => {
        dispatch(actions.populateReviews({ empty: true }));
        dispatch(actions.updateReviewLoader({ fetchAllReviews: false }));
      });
  },
  fetchSingleReview: payload => dispatch => {
    dispatch(actions.updateReviewLoader({ fetch: true }));
    return Api.fetch(payload)
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedReview(utils.camelizeKeys({ ...data.data })),
        );
        dispatch(actions.updateReviewLoader({ fetch: false }));
      })
      .catch(() => {
        dispatch(actions.updateReviewLoader({ fetch: false }));
      });
  },
  changeReviewStatus: (
    payload,
    notificationHandler,
    successHandler,
  ) => dispatch => {
    dispatch(actions.updateReviewLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateReviewTicketForm({ empty: true }));
        dispatch(actions.updateReviewLoader({ submit: false }));
        successHandler();
        notificationHandler('Processing complete', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateReviewLoader({ submit: false }));
      });
  },
  updateReview: payload => dispatch => {
    dispatch(actions.updateReviewLoader({ update: true }));
    return Api.put(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateReviewLoader({ update: false }));
      })
      .catch(() => {
        dispatch(actions.updateReviewLoader({ update: false }));
      });
  },
};

export default actions;
