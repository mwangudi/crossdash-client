import * as types from './actionTypes';

const defaultTitle = 'Crossdash';

export const initialState = {
  activePage: defaultTitle,
  activeRoute: '',
  sharedLoader: {
    fetch: false,
    fetchAll: false,
    submit: false,
  },
  identificationTypes: [],
  openSidebar: false,
};

export const reducer = (state = initialState, action) => {
  let activePage = '';

  switch (action.type) {
    case types.UPDATE_DOCUMENT_TITLE:
      activePage = action.payload || state.activePage;
      if (activePage) {
        document.title = `${activePage} | ${defaultTitle}`;
      } else {
        document.title = defaultTitle;
      }
      return {
        ...state,
        activePage,
      };
    case types.UPDATE_DOCUMENT_ROUTE:
      return {
        ...state,
        activeRoute: action.payload,
      };
    case types.UPDATE_SHARED_LOADER:
      return {
        ...state,
        sharedLoader: {
          ...state.sharedLoader,
          ...action.payload,
        },
      };
    case types.POPULATE_IDENTITY_TYPES:
      return {
        ...state,
        identificationTypes: action.payload,
      };
    case types.TOGGLE_SIDEBAR_MENU:
      return {
        ...state,
        openSidebar: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
