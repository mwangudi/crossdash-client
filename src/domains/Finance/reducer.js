import { isNil, isEqual } from 'lodash';

import * as types from './actionTypes';

const emptyFinanceTicketForm = {
  notes: '',
};

export const initialState = {
  financeLoader: {
    fetch: false,
    fetchAllFinances: false,
    fetchAllFinanciers: false,
    submit: false,
    update: false,
  },
  financiers: [],
  finances: [],
  financePagination: {
    pageNumber: 1,
    pageSize: 15,
  },
  selectedFinance: {},
  financePaginationLinks: {},
  financeModal: {
    openReassignFinance: false,
    openAssignFinance: false,
  },
  financeTicketForm: {
    ...emptyFinanceTicketForm,
  },
};

export const reducer = (state = initialState, action) => {
  let finances = [];
  let financiers = [];
  let financePaginationLinks = {};
  let selectedFinance = {};
  let financeTicketForm = {
    ...emptyFinanceTicketForm,
  };

  switch (action.type) {
    case types.UPDATE_FINANCE_LOADER:
      return {
        ...state,
        financeLoader: {
          ...state.financeLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_FINANCIERS:
      if (!action.payload.empty) {
        financiers = [...action.payload];
      }
      return {
        ...state,
        financiers,
      };
    case types.UPDATE_FINANCE_PAGINATION:
      return {
        ...state,
        financePagination: {
          ...state.financePagination,
          ...action.payload,
        },
      };
    case types.UPDATE_FINANCE_PAGINATION_LINKS:
      if (!action.payload.empty) {
        financePaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        financePaginationLinks,
      };
    case types.POPULATE_FINANCES:
      if (!action.payload.empty) {
        finances = [...action.payload];
      }
      return {
        ...state,
        finances,
      };
    case types.UPDATE_SELECTED_FINANCE:
      if (!action.payload.empty) {
        selectedFinance = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedFinance,
      };
    case types.UPDATE_FINANCE_MODAL:
      return {
        ...state,
        financeModal: {
          ...state.financeModal,
          ...action.payload,
        },
      };
    case types.MANAGE_FINANCES:
      if (!isNil(action.payload.update) && action.payload.update) {
        finances = [
          ...state.finances.map(financed =>
            isEqual(financed.links.claim, action.payload.links.claim)
              ? {
                  ...financed,
                  attributes: {
                    ...financed.attributes,
                    priority: action.payload.attributes.priority,
                    finance: action.payload.attributes.finance.name,
                    assigner: action.payload.attributes.assigner.name,
                  },
                }
              : financed,
          ),
        ];
      } else if (!isNil(action.payload.delete) && action.payload.delete) {
        finances = [
          ...state.finances.filter(
            financed =>
              !isEqual(financed.links.claim, action.payload.links.claim),
          ),
        ];
      }
      return {
        ...state,
        finances,
      };
    case types.UPDATE_FINANCE_TICKET_FORM:
      if (!action.payload.empty) {
        financeTicketForm = {
          ...action.payload,
        };
      }
      return {
        ...state,
        financeTicketForm,
      };
    default:
      return state;
  }
};

export default reducer;
