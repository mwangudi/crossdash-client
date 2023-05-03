import React from 'react';
import Icon from 'react-icons-kit';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { ic_verified_user as icVerify } from 'react-icons-kit/md/ic_verified_user';

import actions from '../../store/rootActions';
import AssessTable from '../Assess/AssessTable';

const InApprovalQueue = props => {
  const {
    assess: { assessLoader, assessmentPagination },
    fetchAssessments,
  } = props;
  const { pathname } = useLocation();

  React.useEffect(() => {
    const fetchAssessmentsAsync = async () => {
      await fetchAssessments({
        scope: '/claim_assessment_queues',
        query: {
          'page[size]': assessmentPagination.pageSize,
          'page[number]': assessmentPagination.pageNumber,
          status: 'ready_for_approval',
        },
      });
    };

    fetchAssessmentsAsync();
  }, [fetchAssessments, assessmentPagination]);

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon icon={icVerify} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      {!assessLoader.fetchAllAssessments && <AssessTable />}
      {assessLoader.fetchAllAssessments && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    assess: state.assess,
  };
}

InApprovalQueue.propTypes = {
  assess: PropTypes.object.isRequired,
  fetchAssessments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(InApprovalQueue);
