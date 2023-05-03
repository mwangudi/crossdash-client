import { isNil, isEqual } from 'lodash';

import * as types from './actionTypes';

const emptyApprovalTicketForm = {
  approvalNotes: '',
};

export const initialState = {
  approvalLoader: {
    fetch: false,
    fetchAll: false,
    submit: false,
  },
  approvers: [],
  approvals: [],
  approvalPagination: {
    pageNumber: 1,
    pageSize: 15,
  },
  selectedApproval: {},
  approvalPaginationLinks: {},
  assessmentModal: {
    openReassignApprover: false,
    openAssignFinance: false,
  },
  approvalTicketForm: {
    ...emptyApprovalTicketForm,
  },
};

export const reducer = (state = initialState, action) => {
  let approvals = [];
  let approvers = [];
  let approvalPaginationLinks = {};
  let selectedApproval = {};
  let approvalTicketForm = {
    ...emptyApprovalTicketForm,
  };

  switch (action.type) {
    case types.UPDATE_APPROVAL_LOADER:
      return {
        ...state,
        approvalLoader: {
          ...state.approvalLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_APPROVERS:
      if (!action.payload.empty) {
        approvers = [...action.payload];
      }
      return {
        ...state,
        approvers,
      };
    case types.UPDATE_APPROVAL_PAGINATION:
      return {
        ...state,
        approvalPagination: {
          ...state.approvalPagination,
          ...action.payload,
        },
      };
    case types.UPDATE_APPROVAL_PAGINATION_LINKS:
      if (!action.payload.empty) {
        approvalPaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        approvalPaginationLinks,
      };
    case types.POPULATE_APPROVALS:
      if (!action.payload.empty) {
        approvals = [...action.payload.approvals];
      }
      return {
        ...state,
        approvals,
      };
    case types.UPDATE_SELECTED_APPROVAL:
      if (!action.payload.empty) {
        selectedApproval = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedApproval,
      };
    case types.UPDATE_APPROVAL_MODAL:
      return {
        ...state,
        assessmentModal: {
          ...state.assessmentModal,
          ...action.payload,
        },
      };
    case types.MANAGE_APPROVALS:
      if (!isNil(action.payload.delete) && action.payload.delete) {
        approvals = [
          ...state.approvals.filter(
            approval =>
              !isEqual(approval.links.claim, action.payload.links.claim),
          ),
        ];
      }
      return {
        ...state,
        approvals,
      };
    case types.UPDATE_APPROVAL_TICKET_FORM:
      if (!action.payload.empty) {
        approvalTicketForm = {
          ...action.payload,
        };
      }
      return {
        ...state,
        approvalTicketForm,
      };
    default:
      return state;
  }
};

export default reducer;
