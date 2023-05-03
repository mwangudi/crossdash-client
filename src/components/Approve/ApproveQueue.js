import React from 'react';
import Icon from 'react-icons-kit';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { ic_thumb_up as icThumbsUp } from 'react-icons-kit/md/ic_thumb_up';
import { ic_thumb_down as icThumbsDown } from 'react-icons-kit/md/ic_thumb_down';
import { isEqual, trimEnd, startCase, capitalize, split } from 'lodash';
import { useSnackbar } from 'notistack';

import actions from '../../store/rootActions';
import ApproveTable from './ApproveTable';
import Modal from '../Shared/Modal';
import AssignmentForm from '../Claims/AssignmentForm';

const ApproveQueue = props => {
  const {
    approve: { approvalLoader, selectedApproval, approvalPagination },
    finance: { financiers, financeLoader, financeModal },
    fetchApprovals,
    fetchFinanciers,
    updateFinanceModal,
    assignFinance,
    updateSelectedApproval,
  } = props;
  const { pathname } = useLocation();
  const { status } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const fetchAsync = async () => {
      await Promise.all([
        fetchApprovals({
          scope: '/claim_approval_queues',
          query: {
            'page[size]': approvalPagination.pageSize,
            'page[number]': approvalPagination.pageNumber,
            status,
          },
        }),
        fetchFinanciers({
          scope: '/finances',
        }),
      ]);
    };

    fetchAsync();
  }, [fetchApprovals, approvalPagination, status, fetchFinanciers]);

  const showFinanciers = () => {
    const options = [
      ...financiers.map(financier => {
        return {
          value: financier.id,
          title: `${startCase(financier.attributes.name)} (${capitalize(
            trimEnd(financier.type, 's'),
          )})`,
        };
      }),
    ];
    return options;
  };

  const closeAssignFinanceModal = () => {
    updateFinanceModal({
      openAssignFinance: false,
    });
    updateSelectedApproval({ empty: true });
  };

  const handleAssignFinance = approval => async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    const claimId = split(approval.links.claim, '/')[2];
    await assignFinance(
      {
        scope: `/claim_disbursement_queues/assign_finance`,
        data: {
          financeId: assigneeId,
          claimId,
          approvedTicketId: approval.id,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      closeAssignFinanceModal,
    );
  };

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon
          icon={isEqual('rejected', status) ? icThumbsDown : icThumbsUp}
          size={22}
        />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      <Modal
        title="Assign Finance"
        open={financeModal.openAssignFinance}
        handleCancel={closeAssignFinanceModal}
        successLabel="Assign"
        loading={financeLoader.submit}
        id="assignFinanceId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignFinanceId"
          actors={showFinanciers()}
          handleSubmit={handleAssignFinance(selectedApproval)}
        />
      </Modal>
      {!approvalLoader.fetchAll && <ApproveTable />}
      {approvalLoader.fetchAll && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    approve: state.approve,
    finance: state.finance,
  };
}

ApproveQueue.propTypes = {
  approve: PropTypes.object.isRequired,
  finance: PropTypes.object.isRequired,
  assignFinance: PropTypes.func.isRequired,
  fetchApprovals: PropTypes.func.isRequired,
  fetchFinanciers: PropTypes.func.isRequired,
  updateFinanceModal: PropTypes.func.isRequired,
  updateSelectedApproval: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(ApproveQueue);
