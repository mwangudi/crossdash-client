import React from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  ButtonBase,
  Menu,
  MenuItem,
  Hidden,
  IconButton,
} from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_keyboard_arrow_down as icArrowDown } from 'react-icons-kit/md/ic_keyboard_arrow_down';
import { ic_search as icSearch } from 'react-icons-kit/md/ic_search';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce, isEmpty, isEqual } from 'lodash';
import { useLocation } from 'react-router-dom';
import { ic_menu as icMenu } from 'react-icons-kit/md/ic_menu';

import Avatar from './Avatar';
import actions from '../../store/rootActions';
import CustomerFilter from '../Customers/Filter';

const drawerWidth = 220;

const Div = styled.div`
  .root {
    flex-grow: 1;
  }

  .appBar {
    background-color: #fff;
  }

  .name {
    color: #706e6e;
    font-size: 12px;
  }

  .moreOptionsIcon {
    color: #40b5e5;
  }

  label + .MuiInput-formControl {
    margin-top: 0px;
    margin-bottom: 5px;
  }

  ${props => props.theme.breakpoints.up('md')} {
    .appBar {
      width: calc(100% - ${drawerWidth}px);
    }
  }
`;

const StyledTextField = styled(TextField)`
  input {
    padding-top: 14px;
    padding-bottom: 10px;
  }

  .searchIcon {
    color: rgba(0, 0, 0, 0.54);
  }

  .MuiFormLabel-root.Mui-focused {
    .searchIcon {
      color: #3f51b5;
    }
  }
`;

const Label = () => {
  return (
    <div className="d-flex flex-row align-items-center">
      <div className="searchIcon">
        <Icon icon={icSearch} size={20} />
      </div>
      <span>Search</span>
    </div>
  );
};

const Navbar = props => {
  const {
    auth: {
      authUser: { name },
    },
    customer: { individualCustomerType },
    logout,
    searchCustomers,
    fetchClaims,
    toggleSidebar,
  } = props;
  const [logoutAnchorEl, setLogoutAnchorEl] = React.useState(null);
  const { pathname } = useLocation();

  const handleClick = event => {
    setLogoutAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setLogoutAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const pathStartsWith = path => isEqual(path, pathname);

  const searchCustomersAsync = async search => {
    const scope = individualCustomerType
      ? '/individual_customers/search'
      : '/corporate_customers/search';

    if (!isEmpty(search)) {
      await searchCustomers({
        scope,
        query: {
          query: search,
        },
        data: {},
      });
    }
  };

  const searchClaimsAsync = async search => {
    await fetchClaims({
      scope: '/claims',
      query: {
        limit: 55,
        status: '',
        query: search,
      },
    });
  };

  const handleSearch = search => {
    switch (true) {
      case pathStartsWith('/customers'):
        searchCustomersAsync(search);
        break;
      case pathStartsWith('/all-claims'):
        searchClaimsAsync(search);
        break;
      default:
        break;
    }
  };

  const assignPlaceHolder = () => {
    switch (true) {
      case pathStartsWith('/customers'):
        return 'search Customer Name';

      case pathStartsWith('/all-claims'):
        return 'Search By Claim Ref.no';
      default:
        return '';
    }
  };

  const timeOutSearch = debounce(handleSearch, 1000);

  const handleChange = e => {
    const {
      target: { value },
    } = e;
    timeOutSearch(value);
  };

  const handleOpenSidebar = () => toggleSidebar(true);

  return (
    <Div className="root">
      <AppBar position="fixed" className="appBar">
        <Toolbar variant="dense">
          <div className="d-flex flex-row align-items-center w-100">
            <Hidden mdUp implementation="js">
              <IconButton onClick={handleOpenSidebar}>
                <Icon icon={icMenu} size={28} />
              </IconButton>
            </Hidden>
            <div className="d-flex flex-grow-1">
              <div className="py-1 pr-5 w-75 d-flex flex-row align-items-center">
                {(pathStartsWith('/customers') ||
                  pathStartsWith('/all-claims')) && (
                  <StyledTextField
                    id="searchbar"
                    label={<Label />}
                    variant="standard"
                    size="small"
                    placeholder={assignPlaceHolder()}
                    onChange={handleChange}
                    fullWidth
                  />
                )}

                {pathStartsWith('/customers') && <CustomerFilter />}
              </div>
            </div>
            <div className="d-flex flex-row align-items-center">
              <ButtonBase
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <div className="d-flex flex-row align-items-center">
                  <Avatar size="md" />
                  <span className="px-2 name">{name}</span>
                  <div className="moreOptionsIcon">
                    <Icon size={20} icon={icArrowDown} />
                  </div>
                </div>
              </ButtonBase>
              <Menu
                id="profile-menu"
                anchorEl={logoutAnchorEl}
                keepMounted
                open={Boolean(logoutAnchorEl)}
                onClose={handleClose}
              >
                <MenuItem className="px-5 pt-3" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Div>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  searchCustomers: PropTypes.func.isRequired,
  fetchClaims: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    customer: state.customer,
  };
}

export default connect(mapStateToProps, actions)(Navbar);
