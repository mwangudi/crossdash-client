import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import Icon from 'react-icons-kit';
import { useLocation } from 'react-router-dom';
import { ic_lightbulb_outline as icLightbulb } from 'react-icons-kit/md/ic_lightbulb_outline';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { isEmpty, capitalize, trimEnd, isNil } from 'lodash';

import utils from 'utils';
import ClaimsTable from './ClaimsTable';
import actions from '../../store/rootActions';
import FilterByStatus from './FilterByStatus';
import RangePicker from '../Shared/CustomRange';
import AssignmentForm from './AssignmentForm';
import Modal from '../Shared/Modal';

const AllClaims = props => {
  const {
    claim: { claimsLoader, claimsPagination, selectedClaim },
    review: { reviewers, reviewLoader },
    fetchClaims,
    fetchReviewers,
    assignReviewer,
    updateSelectedClaim,
  } = props;
  const [currentStatus, setCurrentStatus] = React.useState('new');
  const [pickedDate, setPickedDate] = React.useState({
    startDate: null,
    endDate: null,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const { pathname } = useLocation();

  React.useEffect(() => {
    const fetchClaimAsync = async () => {
      const { pageNumber, pageSize } = claimsPagination;

      await fetchClaims({
        scope: '/claims',
        query: {
          'page[size]': pageSize,
          'page[number]': pageNumber,

          status: currentStatus,
        },
      });
    };

    fetchClaimAsync();
  }, [fetchClaims, claimsPagination, currentStatus]);

  React.useEffect(() => {
    const { startDate, endDate } = pickedDate;
    const fetchClaimAsync = async () => {
      if (!isNil(startDate) && !isNil(endDate)) {
        await fetchClaims({
          scope: '/claims',
          query: {
            limit: 45,
            'date[from]': startDate,
            'date[to]': endDate,
            status: currentStatus,
          },
        });
        setPickedDate({
          startDate: null,
          endDate: null,
        });
      }
    };

    fetchClaimAsync();
  }, [pickedDate, fetchClaims, setPickedDate, currentStatus]);

  const handleOpenModal = async () => {
    if (isEmpty(reviewers)) {
      await fetchReviewers({
        scope: '/reviewers',
      });
    }
    toggleModal();
  };

  const handleCloseModal = () => {
    toggleModal();
    updateSelectedClaim({ empty: true });
  };

  const handleSubmit = async payload => {
    const { assigneeId, assignerNotes, priority } = payload;
    await assignReviewer(
      {
        scope: '/claim_review_queues/assign_reviewer',
        data: {
          claimId: selectedClaim.id,
          reviewerId: assigneeId,
          assignerNotes,
          priority,
        },
      },
      enqueueSnackbar,
      handleCloseModal,
    );
  };

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

  const handleChange = ({ startDate, endDate }) => {
    setPickedDate({
      startDate: utils.formatDate(startDate, 'YYYY-MM-DD'),
      endDate: utils.formatDate(endDate, 'YYYY-MM-DD'),
    });
  };

  return (
    <div className="px-5 pb-3">
      <div className="d-flex flex-row align-items-center py-5">
        <Icon icon={icLightbulb} size={22} />
        <span className="px-3 text-capitalize">{pathname.substring(1)}</span>
        <div className="d-flex flex-row align-items-center justify-content-end flex-grow-1">
          <RangePicker label="Pick a range of dates" onChange={handleChange} />
          <FilterByStatus status={currentStatus} setStatus={setCurrentStatus} />
        </div>
      </div>
      <Modal
        title="Assign a claim"
        open={openModal}
        handleCancel={handleCloseModal}
        successLabel="Assign"
        loading={reviewLoader.submit}
        id="assignReviewerId"
        submittingForm
        showSuccess
      >
        <AssignmentForm
          id="assignReviewerId"
          actors={showReviewers()}
          handleSubmit={handleSubmit}
        />
      </Modal>
      {!claimsLoader.fetchAllClaims && (
        <ClaimsTable handleOpenModal={handleOpenModal} />
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

    review: state.review,
  };
}

AllClaims.propTypes = {
  claim: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired,
  fetchClaims: PropTypes.func.isRequired,
  fetchReviewers: PropTypes.func.isRequired,
  assignReviewer: PropTypes.func.isRequired,
  updateSelectedClaim: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(AllClaims);
