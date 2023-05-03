import React from 'react';
import Icon from 'react-icons-kit';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { ic_loop as icLoop } from 'react-icons-kit/md/ic_loop';
import { useSnackbar } from 'notistack';
import { trimEnd, capitalize, startCase, split } from 'lodash';

import actions from '../../store/rootActions';
import ReviewTable from './ReviewTable';
import Modal from '../Shared/Modal';
import AssignmentForm from '../Claims/AssignmentForm';

const ReviewQueue = props => {
  const { pathname } = useLocation();
  const {
    review: {
      reviewLoader,
      reviewPagination,
      reviewers,
      reviewModal,
      selectedReview,
    },
    assess: { assessors, assessLoader },
    fetchReviews,
    fetchReviewers,
    updateReviewModal,
    reAssignReview,
    fetchAssessors,
    assignAssessor,
    updateSelectedReview,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const fetchAsync = async () => {
      await Promise.all([
        fetchReviews({
          scope: '/claim_review_queues',
          query: {
            'page[size]': reviewPagination.pageSize,
            'page[number]': reviewPagination.pageNumber,
          },
        }),
        fetchReviewers({
          scope: '/reviewers',
        }),
        fetchAssessors({
          scope: '/assessors',
        }),
      ]);
    };
    fetchAsync();
  }, [fetchReviews, reviewPagination, fetchReviewers, fetchAssessors]);

  const showReviewers = () => {
    const options = [
      ...reviewers.map(reviewer => {
        return {
          value: reviewer.id,
          title: `${reviewer.attributes.name} (${capitalize(
            trimEnd(reviewer.type, 's'),
          )})`,
        };
      }),
    ];
    return options;
  };

  const showAssessors = () => {
    const options = [
      ...assessors.map(assessor => {
        return {
          value: assessor.id,
          title: `${startCase(assessor.attributes.name)} (${capitalize(
            trimEnd(assessor.type, 's'),
          )})`,
        };
      }),
    ];
    return options;
  };

  const closeReviewModal = () => {
    updateReviewModal({
      openReassignReviewer: false,
    });
    updateSelectedReview({ empty: true });
  };
  const closeAssignAssessorModal = () => {
    updateReviewModal({
      openAssignAssessor: false,
    });
    updateSelectedReview({ empty: true });
  };

  const handleReassign = async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    await reAssignReview(
      {
        scope: `/claim_review_queues/${selectedReview.id}/reassign_reviewer`,
        data: {
          reviewerId: assigneeId,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      closeReviewModal,
    );
  };

  const handleAssignAssessor = review => async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    const claimId = split(review.links.claim, '/')[2];

    await assignAssessor(
      {
        scope: `/claim_assessment_queues/assign_assessor`,
        data: {
          claimId,
          reviewTicketId: selectedReview.id,
          assessorId: assigneeId,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      closeAssignAssessorModal,
    );
  };

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon icon={icLoop} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      <Modal
        title="Reassign to another reviewer"
        open={reviewModal.openReassignReviewer}
        handleCancel={closeReviewModal}
        successLabel="Reassign"
        loading={reviewLoader.submit}
        id="assignReviewerId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignReviewerId"
          actors={showReviewers()}
          handleSubmit={handleReassign}
        />
      </Modal>
      <Modal
        title="Assign an assessor"
        open={reviewModal.openAssignAssessor}
        handleCancel={closeAssignAssessorModal}
        successLabel="Assign"
        loading={assessLoader.submit}
        id="assignAssessorId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignAssessorId"
          actors={showAssessors()}
          handleSubmit={handleAssignAssessor(selectedReview)}
        />
      </Modal>
      {reviewLoader.fetchAllReviews && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
      {!reviewLoader.fetchAllReviews && <ReviewTable />}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    review: state.review,
    assess: state.assess,
  };
}

ReviewQueue.propTypes = {
  review: PropTypes.object.isRequired,
  assess: PropTypes.object.isRequired,
  fetchReviews: PropTypes.func.isRequired,
  fetchReviewers: PropTypes.func.isRequired,
  updateReviewModal: PropTypes.func.isRequired,
  reAssignReview: PropTypes.func.isRequired,
  fetchAssessors: PropTypes.func.isRequired,
  assignAssessor: PropTypes.func.isRequired,
  updateSelectedReview: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(ReviewQueue);
