import React from 'react';
import Icon from 'react-icons-kit';
import { ic_dashboard as icDash } from 'react-icons-kit/md/ic_dashboard';
import { useLocation, useParams } from 'react-router-dom';
import { ic_loop as icLoop } from 'react-icons-kit/md/ic_loop';
import { ic_report as icReport } from 'react-icons-kit/md/ic_report';
import { money as icMoney } from 'react-icons-kit/fa/money';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

import StatsCard from './ClaimStatisticCard';
import actions from '../../store/rootActions';
import DashboardClaimsTable from './DashboardClaimsTable';
import ClaimsTable from './ClaimsTable';

const Dashboard = props => {
  const {
    claim: { claimsLoader, claimsPagination },
    auth: { authRoles },
    fetchClaims,
  } = props;
  const { pathname } = useLocation();
  const { status } = useParams();

  const cards = [
    {
      cardIcon: icLoop,
      cardTitle: 'Total Pending',
      cardTotal: 110,
      rateOfChange: '60%',
      bg: `background: rgb(2, 117, 216);
background: linear-gradient(110deg, rgba(2, 117, 216,1) 0%, rgba(13,60,209,1) 63%);`,
    },
    {
      cardIcon: icMoney,
      cardTitle: 'Total Paid',
      cardTotal: 320,
      rateOfChange: '30%',
      bg: `background: rgb(92, 184, 92);
background: linear-gradient(110deg, rgba(92, 184, 92,1) 0%, rgba(0,212,50,1) 58%);`,
    },
    {
      cardIcon: icReport,
      cardTitle: 'Total Rejected',
      cardTotal: 50,
      rateOfChange: '80%',
      positive: false,
      bg: `background: rgb(217, 83, 79,60);
background: linear-gradient(110deg, rgba(217, 83, 79,1) 0%, rgba(209,65,13,1) 49%);`,
    },
  ];

  React.useEffect(() => {
    const checkRole = role => authRoles.includes(role);
    const fetchClaimAsync = async () => {
      if (checkRole('customer')) {
        await fetchClaims({
          scope: '/claims',
          query: {
            'page[size]': claimsPagination.pageSize,
            'page[number]': claimsPagination.pageNumber,
            status,
          },
        });
      } else {
        await fetchClaims({
          scope: '/claims',
          query: {
            'page[size]': 10,
            'page[number]': claimsPagination.pageNumber,
            status: 'new',
          },
        });
      }
    };

    fetchClaimAsync();
  }, [claimsPagination, fetchClaims, status, authRoles]);

  const isRole = role => {
    let value = false;
    if (authRoles.includes(role)) {
      value = true;
    }
    return value;
  };

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon icon={icDash} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      {!isRole('customer') && (
        <div className="row pb-5">
          {cards.map((card, index) => (
            <div className="col-md-4 col-12" key={index}>
              <StatsCard cardItem={card} />
            </div>
          ))}
        </div>
      )}

      {!claimsLoader.fetchAllClaims && !isRole('customer') && (
        <DashboardClaimsTable />
      )}
      {!claimsLoader.fetchAllClaims && isRole('customer') && (
        <ClaimsTable handleOpenModal={() => {}} />
      )}
      {claimsLoader.fetchAllClaims && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
    admin: state.admin,
    review: state.review,
    auth: state.auth,
  };
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  claim: PropTypes.object.isRequired,
  fetchClaims: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(Dashboard);
