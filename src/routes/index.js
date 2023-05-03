import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import utils from '../utils';
import actions from '../store/rootActions';
import AppLayout from '../components/Shared/AppLayout';

import NewClaim from '../components/Claims/FileNewClaim';
import Claims from '../components/Claims/ClaimsProfile';
import LoginPage from '../components/Auth/LoginPage';
import Logout from '../components/Auth/Logout';
import CustomersPage from '../components/Customers/CustomersPage';
import ReviewQueue from '../components/Review/ReviewQueue';
import AssessQueue from '../components/Assess/AssessQueue';
import ApprovalQueue from '../components/Approve/ApproveQueue';
import ReadyForApprovalQueue from '../components/Approve/ReadyForApprovalQueue';
import ReviewTicket from '../components/Review/ReviewTicket';
import SingleClaim from '../components/Claims/SingleClaim';
import AssessmentTicket from '../components/Assess/AssessTicket';
import ApprovalTicket from '../components/Approve/ApprovalTicket';
import ApprovalClaimView from '../components/Approve/SingleClaimTicketView';
import FinanceQueue from '../components/Finance/FinanceQueue';
import FinanceTicket from '../components/Finance/FinanceTicket';
import ActiveCustomerView from '../components/Vehicles/ActiveCustomerView';
import CustomerView from '../components/Vehicles/CustomerView';
import AllClaims from '../components/Claims/AllClaims';
import UpdateClaim from '../components/Claims/UpdateClaim';

const Routes = props => {
  const {
    auth: { isAuthenticated, authRoles, authUser },
    updateDocumentRoute,
    updateDocumentTitle,
  } = props;

  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentTimeSeconds = Math.round(date.getTime() / 1000);

  useEffect(() => {
    const isRole = role => {
      let value = false;
      if (authRoles.includes(role)) {
        value = true;
      }
      return value;
    };
    const checkAuthentication = activePage => {
      if (isAuthenticated && activePage.startsWith('/login')) {
        history.push(`/dashboard`);
      } else if (!isAuthenticated && !activePage.startsWith('/login')) {
        history.push(`/login`);
      } else if (
        isRole('customer') &&
        !activePage.startsWith('/dashboard') &&
        !activePage.startsWith('/vehicle') &&
        !activePage.startsWith('/new-claim') &&
        !activePage.startsWith('/update-claim')
      ) {
        history.push('/dashboard');
      }
    };

    const instantiateApp = () => {
      const activePage = location.pathname;
      const page = activePage.split('/')[1];
      const docTitle = page ? utils.capitalizeString(page) : undefined;
      checkAuthentication(activePage);
      updateDocumentRoute(page);
      updateDocumentTitle(docTitle);
    };

    instantiateApp();
  }, [
    location,
    updateDocumentRoute,
    updateDocumentTitle,
    history,
    isAuthenticated,
    authRoles,
  ]);

  useEffect(() => {
    const compareTime = () => {
      const createTime = authUser.createdAt;
      const expireTime = createTime + authUser.expiresIn;

      if (currentTimeSeconds >= expireTime) {
        history.push('/logout');
      }
    };

    compareTime();
  }, [authUser.createdAt, authUser.expiresIn, history, currentTimeSeconds]);

  useEffect(() => {
    const compareTime = () => {
      const tenMinutes = 10 * 60;
      const createTime = authUser.createdAt;
      const expireTime = createTime + authUser.expiresIn - tenMinutes;

      if (currentTimeSeconds >= expireTime) {
        enqueueSnackbar('Your session is about to expire!', {
          variant: 'warning',
        });
      }
    };

    compareTime();
  }, [
    authUser.createdAt,
    authUser.expiresIn,
    enqueueSnackbar,
    currentTimeSeconds,
  ]);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={remProps =>
        isAuthenticated ? (
          <AppLayout>
            <Component {...remProps} />
          </AppLayout>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );

  PrivateRoute.propTypes = {
    component: PropTypes.any.isRequired,
  };

  return (
    <Route
      render={() => (
        <div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route
              path="/login"
              render={loginProps => <LoginPage {...loginProps} />}
            />
            <Route
              path="/logout"
              render={logoutProps => <Logout {...logoutProps} />}
            />
            <PrivateRoute path="/dashboard" exact component={Claims} />
            <PrivateRoute
              path="/dashboard/claim/:claimId"
              exact
              component={SingleClaim}
            />
            <PrivateRoute path="/dashboard/:status" component={Claims} />
            <PrivateRoute path="/customers" exact component={CustomersPage} />
            <PrivateRoute
              path="/customers/vehicles"
              exact
              component={CustomerView}
            />
            <PrivateRoute
              path="/vehicles/me"
              exact
              component={ActiveCustomerView}
            />
            <PrivateRoute exact path="/new-claim" component={NewClaim} />
            <PrivateRoute exact path="/update-claim" component={UpdateClaim} />
            <PrivateRoute path="/review-queue" exact component={ReviewQueue} />
            <PrivateRoute
              path="/review-queue/tickets/:ticketId"
              component={ReviewTicket}
            />
            <PrivateRoute
              path="/assessment-queue"
              exact
              component={AssessQueue}
            />
            <PrivateRoute
              path="/assessment-queue/tickets/:ticketId"
              component={AssessmentTicket}
            />
            <PrivateRoute
              path="/approval-queue"
              exact
              component={ReadyForApprovalQueue}
            />
            <PrivateRoute
              path="/approval-queue/tickets/:ticketId"
              exact
              component={ApprovalTicket}
            />
            <PrivateRoute
              path="/approval-queue/view-claim"
              exact
              component={ApprovalClaimView}
            />
            <PrivateRoute
              path="/approval-queue/:status"
              component={ApprovalQueue}
            />
            <PrivateRoute
              path="/finance-queue"
              exact
              component={FinanceQueue}
            />
            <PrivateRoute
              path="/finance-queue/tickets/:ticketId"
              exact
              component={FinanceTicket}
            />
            <PrivateRoute
              path="/finance-queue/:status"
              component={FinanceQueue}
            />
            <PrivateRoute path="/all-claims" exact component={AllClaims} />
            <Route path="/*" render={() => <Redirect to="/dashboard" />} />
          </Switch>
        </div>
      )}
    />
  );
};

Routes.propTypes = {
  updateDocumentRoute: PropTypes.func.isRequired,
  updateDocumentTitle: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(Routes);
