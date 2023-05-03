import React from 'react';
import Icon from 'react-icons-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { money } from 'react-icons-kit/fa/money';
import { useLocation, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { trimEnd, startCase, capitalize, isEqual } from 'lodash';

import actions from '../../store/rootActions';
import FinanceTable from './FinanceTable';
import Modal from '../Shared/Modal';
import AssignmentForm from '../Claims/AssignmentForm';

const FinanceQueue = props => {
  const {
    finance: {
      financeLoader,
      selectedFinance,
      financeModal,
      financiers,
      financePagination,
    },
    fetchFinances,
    fetchFinanciers,
    reassignFinance,
    updateFinanceModal,
    updateSelectedFinance,
  } = props;
  const { status } = useParams();
  const { pathname } = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const fetchAsync = async () => {
      await Promise.all([
        fetchFinances({
          scope: '/claim_disbursement_queues',
          query: {
            'page[size]': financePagination.pageSize,
            'page[number]': financePagination.pageNumber,
            status: isEqual(status, 'paid') ? status : 'not_paid',
          },
        }),
        fetchFinanciers({
          scope: '/finances',
        }),
      ]);
    };

    fetchAsync();
  }, [fetchFinances, fetchFinanciers, financePagination, status]);

  const closeFinanceModal = () => {
    updateFinanceModal({
      openReassignFinance: false,
    });
    updateSelectedFinance({
      empty: true,
    });
  };

  const handleReassign = async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    await reassignFinance(
      {
        scope: `/claim_disbursement_queues/${selectedFinance.id}/reassign_finance`,
        data: {
          financeId: assigneeId,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      closeFinanceModal,
    );
  };

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

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-3">
        <Icon icon={money} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
      </div>
      <Modal
        title="Reassign ticket"
        open={financeModal.openReassignFinance}
        handleCancel={closeFinanceModal}
        successLabel="Reassign"
        loading={financeLoader.submit}
        id="assignFinanceId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignFinanceId"
          actors={showFinanciers()}
          handleSubmit={handleReassign}
        />
      </Modal>
      {!financeLoader.fetchAllFinances && <FinanceTable />}
      {financeLoader.fetchAllFinances && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    finance: state.finance,
  };
}

FinanceQueue.propTypes = {
  finance: PropTypes.object.isRequired,
  fetchFinances: PropTypes.func.isRequired,
  fetchFinanciers: PropTypes.func.isRequired,
  reassignFinance: PropTypes.func.isRequired,
  updateFinanceModal: PropTypes.func.isRequired,
  updateSelectedFinance: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(FinanceQueue);
