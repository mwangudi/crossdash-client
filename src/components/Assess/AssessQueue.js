import React from 'react';
import Icon from 'react-icons-kit';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { ic_assessment as icAsssessment } from 'react-icons-kit/md/ic_assessment';
import { useSnackbar } from 'notistack';
import { trimEnd, capitalize, startCase } from 'lodash';

import actions from '../../store/rootActions';
import AssessTable from './AssessTable';
import Modal from '../Shared/Modal';
import AssignmentForm from '../Claims/AssignmentForm';

const AssessQueue = props => {
  const { pathname } = useLocation();
  const {
    assess: {
      assessLoader,
      assessmentPagination,
      assessors,
      assessmentModal,
      selectedAssessment,
    },
    fetchAssessments,
    fetchAssessors,
    updateAssessmentModal,
    reAssignAssessor,
    fetchApprovers,
    updateSelectedAssessment,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const fetchAsync = async () => {
      await Promise.all([
        fetchAssessments({
          scope: '/claim_assessment_queues',
          query: {
            'page[size]': assessmentPagination.pageSize,
            'page[number]': assessmentPagination.pageNumber,
          },
        }),
        fetchAssessors({
          scope: '/assessors',
        }),
        fetchApprovers({
          scope: '/approvers',
        }),
      ]);
    };

    fetchAsync();
  }, [fetchAssessments, assessmentPagination, fetchApprovers, fetchAssessors]);

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

  const closeAssessmentModal = () => {
    updateAssessmentModal({
      openReassignAssessor: false,
    });
    updateSelectedAssessment({
      empty: true,
    });
  };

  const handleReassign = async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    await reAssignAssessor(
      {
        scope: `/claim_assessment_queues/${selectedAssessment.id}/reassign_assessor`,
        data: {
          assessorId: assigneeId,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      closeAssessmentModal,
    );
  };

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon icon={icAsssessment} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      <Modal
        title="Reassign to another assessor"
        open={assessmentModal.openReassignAssessor}
        handleCancel={closeAssessmentModal}
        successLabel="Reassign"
        loading={assessLoader.submit}
        id="assignAssessorId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignAssessorId"
          actors={showAssessors()}
          handleSubmit={handleReassign}
        />
      </Modal>
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
    approve: state.approve,
  };
}

AssessQueue.propTypes = {
  assess: PropTypes.object.isRequired,
  fetchAssessments: PropTypes.func.isRequired,
  fetchAssessors: PropTypes.func.isRequired,
  updateAssessmentModal: PropTypes.func.isRequired,
  reAssignAssessor: PropTypes.func.isRequired,
  fetchApprovers: PropTypes.func.isRequired,
  updateSelectedAssessment: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(AssessQueue);
