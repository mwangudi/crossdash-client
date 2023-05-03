import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Hidden,
} from '@material-ui/core';
import Icon from 'react-icons-kit';
import { ic_dashboard as icDash } from 'react-icons-kit/md/ic_dashboard';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { isNil, isEqual } from 'lodash';
import { ic_loop as icLoop } from 'react-icons-kit/md/ic_loop';
import { ic_assessment as icAsssessment } from 'react-icons-kit/md/ic_assessment';
import { ic_group as icGroup } from 'react-icons-kit/md/ic_group';
import { ic_verified_user as icVerify } from 'react-icons-kit/md/ic_verified_user';
import { ic_thumb_up as icThumbsUp } from 'react-icons-kit/md/ic_thumb_up';
import { ic_thumb_down as icThumbsDown } from 'react-icons-kit/md/ic_thumb_down';
import { money } from 'react-icons-kit/fa/money';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ic_expand_less as icLess } from 'react-icons-kit/md/ic_expand_less';
import { ic_chevron_right as icRight } from 'react-icons-kit/md/ic_chevron_right';
import { ic_timeline as icTimeline } from 'react-icons-kit/md/ic_timeline';
import { ic_build as icBuild } from 'react-icons-kit/md/ic_build';
import { ic_done as icDone } from 'react-icons-kit/md/ic_done';
import { ic_report as icReport } from 'react-icons-kit/md/ic_report';
import { ic_directions_car as icCar } from 'react-icons-kit/md/ic_directions_car';
import { ic_lightbulb_outline as icLightbulb } from 'react-icons-kit/md/ic_lightbulb_outline';

import Avatar from './Avatar';
import actions from '../../store/rootActions';

const drawerWidth = 220;

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;

  .drawerPaper {
    width: ${drawerWidth}px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
  }

  .sp-user-name {
    font-size: 15px;
    color: #616161;
  }

  .sp-role-name {
    color: #706e6e;
    font-size: 13px;
  }

  .listItem {
    span {
      font-size: 14px;
      font-weight: 500;
    }
  }

  .listItemSecondary {
    span {
      font-size: 13px;
      font-weight: 500;
    }
  }

  .bg-svg {
    height: 300px;
  }

  .s-nested-menu {
    padding-left: ${props => props.theme.spacing(4)}px;
  }

  .s-button-claim {
    text-transform: none;
  }
`;

const selectedLinks = checkRole => {
  const dashboard = {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icDash,
  };
  const customers = {
    title: 'Customers',
    path: '/customers',
    icon: icGroup,
  };
  const inReview = {
    title: 'In Review',
    path: '/review-queue',
    icon: icLoop,
  };
  const inAssessment = {
    title: 'In Assessment',
    path: '/assessment-queue',
    icon: icAsssessment,
  };
  const inApproval = {
    title: 'In Approval',
    path: '/approval-queue',
    icon: icVerify,
  };
  const approved = {
    title: 'Approved',
    path: '/approval-queue/approved',
    icon: icThumbsUp,
  };
  const rejected = {
    title: 'Rejected',
    path: '/approval-queue/rejected',
    icon: icThumbsDown,
  };
  const allClaims = {
    title: 'All claims',
    path: '/all-claims',
    icon: icLightbulb,
  };
  const inFinance = {
    title: 'In Finance',
    path: '/finance-queue',
    icon: money,
  };
  const paid = {
    title: 'Paid',
    path: '/finance-queue/paid',
    icon: icDone,
  };
  const unPaid = {
    title: 'Unpaid',
    path: '/finance-queue/not-paid',
    icon: icReport,
  };
  const vehicles = {
    title: 'Vehicles',
    path: '/vehicles/me',
    icon: icCar,
  };

  let links = [dashboard];
  const processing = {
    title: 'Processing',
    icon: icBuild,
    children: [],
  };
  const reports = {
    title: 'Reports',
    icon: icTimeline,
    children: [],
  };

  switch (true) {
    case checkRole('admin'):
    case checkRole('manager'):
      processing.children = [inReview, inAssessment, inApproval, inFinance];
      reports.children = [rejected, approved, unPaid, paid];
      links = [...links, allClaims, customers, processing, reports];
      break;
    case checkRole('reviewer'):
      processing.children = [inReview];
      links = [...links, processing];
      break;
    case checkRole('assessor'):
      processing.children = [inAssessment];
      links = [...links, processing];
      break;
    case checkRole('approver'):
      processing.children = [inApproval];
      reports.children = [rejected, approved];
      links = [...links, processing, reports];
      break;
    case checkRole('finance'):
      processing.children = [inFinance];
      reports.children = [unPaid, paid];
      links = [...links, processing, reports];
      break;
    case checkRole('customer'):
      links = [dashboard, vehicles];
      break;
    default:
      break;
  }
  return links;
};

const SMenuItem = props => {
  const {
    item: { children, icon, title, path },
  } = props;
  const hasChildren = !isNil(children);
  const [openMenu, setOpenMenu] = React.useState(false);
  const history = useHistory();
  const { pathname } = useLocation();

  const handleToggleMenu = () => setOpenMenu(!openMenu);
  const handleGoTo = setPath => () => history.push(setPath);

  if (hasChildren) {
    return (
      <>
        <ListItem button onClick={handleToggleMenu}>
          <ListItemIcon>
            <Icon icon={icon} size={20} />
          </ListItemIcon>
          <ListItemText className="listItem" primary={title} />
          <div className="px-1">
            <Icon icon={openMenu ? icLess : icRight} size={24} />
          </div>
        </ListItem>
        <Collapse in={openMenu} timeout="auto">
          <List className="pl-2" component="div" disablePadding>
            {children.map(c => (
              <ListItem
                selected={isEqual(pathname, c.path)}
                button
                key={c.title}
                onClick={handleGoTo(c.path)}
              >
                <ListItemIcon>
                  <Icon icon={c.icon} size={18} />
                </ListItemIcon>
                <ListItemText className="listItemSecondary" primary={c.title} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    );
  }
  return (
    <ListItem
      selected={isEqual(pathname, path)}
      button
      key={title}
      onClick={handleGoTo(path)}
    >
      <ListItemIcon>
        <Icon icon={icon} size={22} />
      </ListItemIcon>
      <ListItemText className="listItem" primary={title} />
    </ListItem>
  );
};

SMenuItem.propTypes = {
  item: PropTypes.object.isRequired,
};

const Sidebar = props => {
  const {
    auth: {
      authUser: { name },
      authRoles,
    },
    shared: { openSidebar },
    toggleSidebar,
    clearEmptyClaimsForm,
  } = props;
  const history = useHistory();

  const isRole = role => authRoles.includes(role);
  const goTo = path => history.push(path);

  const handleFileClaim = () => {
    clearEmptyClaimsForm();
    if (isRole('customer')) {
      return goTo('/vehicles/me');
    }
    return goTo('/customers');
  };

  const handleCloseSidebar = () => toggleSidebar(false);

  return (
    <>
      <Hidden mdUp implementation="js">
        <StyledDrawer
          variant="temporary"
          classes={{
            paper: 'drawerPaper',
          }}
          anchor="left"
          open={openSidebar}
          onClose={handleCloseSidebar}
        >
          <div className="d-flex flex-column p-2 h-100">
            <div>
              <span className="title">CrossDash</span>
            </div>
            <div className="d-flex flex-row pt-2">
              <Avatar />
              <div className="d-flex flex-column justify-content-center px-1">
                <span className="text-capitalize sp-user-name">{name}</span>
                <span className="text-capitalize sp-role-name">
                  {authRoles}
                </span>
              </div>
            </div>
            <List>
              {selectedLinks(isRole).map(sl => (
                <SMenuItem item={sl} key={sl.title} />
              ))}
            </List>
            {(isRole('admin') || isRole('customer')) && (
              <div className="p-2 d-flex flex-column justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  className="s-button-claim py-2"
                  onClick={handleFileClaim}
                >
                  File Claim
                </Button>
              </div>
            )}
          </div>
        </StyledDrawer>
      </Hidden>
      <Hidden smDown implementation="js">
        <StyledDrawer
          variant="permanent"
          classes={{
            paper: 'drawerPaper',
          }}
          anchor="left"
        >
          <div className="d-flex flex-column p-2 h-100">
            <div>
              <span className="title">CrossDash</span>
            </div>
            <div className="d-flex flex-row pt-2">
              <Avatar />
              <div className="d-flex flex-column justify-content-center px-1">
                <span className="text-capitalize sp-user-name">{name}</span>
                <span className="text-capitalize sp-role-name">
                  {authRoles}
                </span>
              </div>
            </div>
            <List>
              {selectedLinks(isRole).map(sl => (
                <SMenuItem item={sl} key={sl.title} />
              ))}
            </List>
            {(isRole('admin') || isRole('customer')) && (
              <div className="p-2 d-flex flex-column justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  className="s-button-claim py-2"
                  onClick={handleFileClaim}
                >
                  File Claim
                </Button>
              </div>
            )}
          </div>
        </StyledDrawer>
      </Hidden>
    </>
  );
};

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired,
  shared: PropTypes.object.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  clearEmptyClaimsForm: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    shared: state.shared,
  };
}

export default connect(mapStateToProps, actions)(Sidebar);
