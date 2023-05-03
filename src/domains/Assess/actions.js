import * as types from './actionTypes';
import Api from '../../api';
import utils from '../../utils';
import * as reviewTypes from '../Review/actionTypes';

export const actions = {
  updateAssessLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ASSESS_LOADER,
      payload,
    });
  },
  populateAssessors: payload => dispatch => {
    dispatch({
      type: types.POPULATE_ASSESSORS,
      payload,
    });
  },
  populateAssessments: payload => dispatch => {
    dispatch({
      type: types.POPULATE_ASSESSMENTS,
      payload,
    });
  },
  updateAssessmentPagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ASSESSMENT_PAGINATION,
      payload,
    });
  },
  updateAssessmentPaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ASSESSMENT_PAGINATION_LINKS,
      payload,
    });
  },
  updateSelectedAssessment: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SELECTED_ASSESSMENT,
      payload,
    });
  },
  updateAssessmentModal: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ASSESSMENT_MODAL,
      payload,
    });
  },
  manageAssessments: payload => dispatch => {
    dispatch({
      type: types.MANAGE_ASSESSMENTS,
      payload,
    });
  },
  updateAssessmentTicket: payload => dispatch => {
    dispatch(actions.updateAssessLoader({ update: true }));
    return Api.put(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateAssessLoader({ update: false }));
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ update: false }));
      });
  },
  uploadAssessmentReport: ({ scope, fingerprint, data }) => dispatch => {
    dispatch(actions.updateAssessLoader({ uploadReport: true }));
    const formData = new FormData();
    const { files } = data;
    formData.append('claim_assessment_queue[assessment_report]', files[0]);
    return Api.uploadWithUpdate({
      scope,
      fingerprint,
      data: formData,
    })
      .then(() => {
        dispatch(actions.updateAssessLoader({ uploadReport: false }));
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ uploadReport: false }));
      });
  },
  fetchAssessors: payload => dispatch => {
    dispatch(actions.updateAssessLoader({ fetchAllAssessors: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(actions.populateAssessors(data.data));
        dispatch(actions.updateAssessLoader({ fetchAllAssessors: false }));
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ fetchAllAssessors: false }));
      });
  },
  assignAssessor: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateAssessLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch({
          type: reviewTypes.MANAGE_REVIEWS,
          payload: {
            delete: true,
            ...utils.camelizeKeys(data.data),
          },
        });
        dispatch(actions.updateAssessLoader({ submit: false }));
        completionHandler();
        notificationHandler('Ticket assigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
  fetchAssessments: payload => dispatch => {
    dispatch(actions.updateAssessLoader({ fetchAllAssessments: true }));
    dispatch(actions.populateAssessments({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(
          actions.populateAssessments(
            utils.camelizeKeys({ assessments: data.data }),
          ),
        );
        dispatch(
          actions.updateAssessmentPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateAssessLoader({ fetchAllAssessments: false }));
      })
      .catch(() => {
        dispatch(actions.populateAssessments({ empty: true }));
        dispatch(actions.updateAssessLoader({ fetchAllAssessments: false }));
      });
  },
  reAssignAssessor: (
    payload,
    notificationHandler,
    completionHandler,
  ) => dispatch => {
    dispatch(actions.updateAssessLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(({ data }) => {
        dispatch(
          actions.manageAssessments({
            update: true,
            ...utils.camelizeKeys(data.data),
          }),
        );
        dispatch(actions.updateAssessLoader({ submit: false }));
        completionHandler();
        notificationHandler('Ticket reassigned', {
          variant: 'success',
        });
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ submit: false }));
        completionHandler();
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
      });
  },
  fetchSingleAssessment: payload => dispatch => {
    dispatch(actions.updateAssessLoader({ fetch: true }));
    return Api.fetch(payload)
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedAssessment(
            utils.camelizeKeys({ ...data.data }),
          ),
        );
        dispatch(actions.updateAssessLoader({ fetch: false }));
      })
      .catch(() => {
        dispatch(actions.updateAssessLoader({ fetch: false }));
      });
  },
  changeAssessmentStatus: (
    payload,
    notificationHandler,
    successHandler,
  ) => dispatch => {
    dispatch(actions.updateAssessLoader({ submit: true }));
    return Api.create(utils.decamelizeKeys(payload))
      .then(() => {
        dispatch(actions.updateAssessLoader({ submit: false }));
        successHandler();
        notificationHandler('Processing complete', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateAssessLoader({ submit: false }));
      });
  },
};

export default actions;
