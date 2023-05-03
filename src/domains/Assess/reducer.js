import { isNil, isEqual } from 'lodash';

import * as types from './actionTypes';

export const initialState = {
  assessLoader: {
    fetch: false,
    fetchAllAssessors: false,
    fetchAllAssessments: false,
    submit: false,
    update: false,
    uploadReport: false,
  },
  assessors: [],
  assessments: [],
  assessmentPagination: {
    pageNumber: 1,
    pageSize: 15,
  },
  selectedAssessment: {},
  assessmentPaginationLinks: {},
  assessmentModal: {
    openReassignAssessor: false,
    openAssignApprover: false,
  },
};

export const reducer = (state = initialState, action) => {
  let assessments = [];
  let assessors = [];
  let assessmentPaginationLinks = {};
  let selectedAssessment = {};

  switch (action.type) {
    case types.UPDATE_ASSESS_LOADER:
      return {
        ...state,
        assessLoader: {
          ...state.assessLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_ASSESSORS:
      if (!action.payload.empty) {
        assessors = [...action.payload];
      }
      return {
        ...state,
        assessors,
      };
    case types.UPDATE_ASSESSMENT_PAGINATION:
      return {
        ...state,
        assessmentPagination: {
          ...state.assessmentPagination,
          ...action.payload,
        },
      };
    case types.UPDATE_ASSESSMENT_PAGINATION_LINKS:
      if (!action.payload.empty) {
        assessmentPaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        assessmentPaginationLinks,
      };
    case types.POPULATE_ASSESSMENTS:
      if (!action.payload.empty) {
        assessments = [...action.payload.assessments];
      }
      return {
        ...state,
        assessments,
      };
    case types.UPDATE_SELECTED_ASSESSMENT:
      if (!action.payload.empty) {
        selectedAssessment = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedAssessment,
      };
    case types.UPDATE_ASSESSMENT_MODAL:
      return {
        ...state,
        assessmentModal: {
          ...state.assessmentModal,
          ...action.payload,
        },
      };
    case types.MANAGE_ASSESSMENTS:
      if (!isNil(action.payload.update) && action.payload.update) {
        assessments = [
          ...state.assessments.map(assessment =>
            isEqual(assessment.links.claim, action.payload.links.claim)
              ? {
                  ...assessment,
                  attributes: {
                    ...assessment.attributes,
                    priority: action.payload.attributes.priority,
                    assessor: action.payload.attributes.assessor.name,
                    assigner: action.payload.attributes.assigner.name,
                  },
                }
              : assessment,
          ),
        ];
      } else if (!isNil(action.payload.delete) && action.payload.delete) {
        assessments = [
          ...state.assessments.filter(
            assessment =>
              !isEqual(assessment.links.claim, action.payload.links.claim),
          ),
        ];
      }
      return {
        ...state,
        assessments,
      };
    default:
      return state;
  }
};

export default reducer;
