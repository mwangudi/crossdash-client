import * as types from './actionTypes';

export const initialState = {
  customersLoader: {
    fetchCustomer: false,
    fetchAllCustomers: false,
    fetchAllCorporateCustomers: false,
    submit: false,
  },
  individualCustomerType: true,
  customers: [],
  selectedCustomer: {},
  customerPaginationLinks: {},
  customersPagination: {
    pageNumber: 1,
    pageSize: 15,
  },
};

export const reducer = (state = initialState, action) => {
  let customers = [];
  let selectedCustomer = {};
  let customerPaginationLinks = {};

  switch (action.type) {
    case types.UPDATE_CUSTOMERS_LOADER:
      return {
        ...state,
        customersLoader: {
          ...state.customersLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_CUSTOMERS: {
      if (!action.payload.empty) {
        customers = [...action.payload.customers];
      }
      return {
        ...state,
        customers,
      };
    }
    case types.UPDATE_SELECTED_CUSTOMER: {
      if (!action.payload.empty) {
        selectedCustomer = {
          ...action.payload,
        };
      }
      return {
        ...state,
        selectedCustomer,
      };
    }
    case types.UPDATE_CUSTOMER_PAGINATION:
      return {
        ...state,
        customersPagination: {
          ...state.customersPagination,
          ...action.payload,
        },
      };
    case types.UPDATE_CUSTOMER_PAGINATION_LINKS:
      if (!action.payload.empty) {
        customerPaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        customerPaginationLinks,
      };
    case types.TOGGLE_CUSTOMER_TYPE:
      return {
        ...state,
        individualCustomerType: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
