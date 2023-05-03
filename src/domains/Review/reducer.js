import { isNil, isEqual } from 'lodash';

import * as types from './actionTypes';

const emptyReviewTicketForm = {
  reviewNotes: '',
  noteToCustomer: '',
};

export const initialState = {
  reviewLoader: {
    fetch: false,
    fetchAllReviewers: false,
    fetchAllReviews: false,
    submit: false,
    update: false,
  },
  reviewers: [],
  reviews: [],
  reviewPagination: {
    pageNumber: 1,
    pageSize: 15,
  },
  selectedReview: {},
  reviewPaginationLinks: {},
  reviewModal: {
    openReassignReviewer: false,
    openAssignAssessor: false,
  },
  reviewTicketForm: {
    ...emptyReviewTicketForm,
  },
};

export const reducer = (state = initialState, action) => {
  let reviewers = [];
  let reviews = [];
  let reviewPaginationLinks = {};
  let selectedReview = {};
  let reviewTicketForm = {
    ...emptyReviewTicketForm,
  };

  switch (action.type) {
    case types.POPULATE_REVIEWERS:
      if (!action.payload.empty) {
        reviewers = [...action.payload];
      }
      return {
        ...state,
        reviewers,
      };
    case types.UPDATE_REVIEW_LOADER:
      return {
        ...state,
        reviewLoader: {
          ...state.reviewLoader,
          ...action.payload,
        },
      };
    case types.UPDATE_REVIEW_PAGINATION:
      return {
        ...state,
        reviewPagination: {
          ...state.reviewPagination,
          ...action.payload,
        },
      };
    case types.UPDATE_REVIEW_PAGINATION_LINKS:
      if (!action.payload.empty) {
        reviewPaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        reviewPaginationLinks,
      };
    case types.POPULATE_REVIEWS:
      if (!action.payload.empty) {
        reviews = [...action.payload.reviews];
      }
      return {
        ...state,
        reviews,
      };
    case types.UPDATE_REVIEW_MODAL:
      return {
        ...state,
        reviewModal: {
          ...state.reviewModal,
          ...action.payload,
        },
      };
    case types.UPDATE_SELECTED_REVIEW:
      if (!action.payload.empty) {
        selectedReview = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedReview,
      };
    case types.MANAGE_REVIEWS:
      if (!isNil(action.payload.update) && action.payload.update) {
        reviews = [
          ...state.reviews.map(review =>
            isEqual(review.links.claim, action.payload.links.claim)
              ? {
                  ...review,
                  attributes: {
                    ...review.attributes,
                    priority: action.payload.attributes.priority,
                    reviewer: action.payload.attributes.reviewer.name,
                    assigner: action.payload.attributes.assigner.name,
                  },
                }
              : review,
          ),
        ];
      } else if (!isNil(action.payload.delete) && action.payload.delete) {
        reviews = [
          ...state.reviews.filter(
            review => !isEqual(review.links.claim, action.payload.links.claim),
          ),
        ];
      }
      return {
        ...state,
        reviews,
      };
    case types.UPDATE_REVIEW_TICKET_FORM:
      if (!action.payload.empty) {
        reviewTicketForm = {
          ...action.payload,
        };
      }
      return {
        ...state,
        reviewTicketForm,
      };
    default:
      return state;
  }
};

export default reducer;
