import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Paper,
  Chip,
  CircularProgress,
  colors,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { isEmpty, isEqual, debounce } from 'lodash';
import { useSnackbar } from 'notistack';

import actions from '../../store/rootActions';
import utils from '../../utils';
import TextField from '../Shared/TextField';
import SingleClaimTicketView from './SingleClaimTicketView';
import DataContainer from '../Shared/DataContainer';
import Switch from '../Shared/Switch';
import ZoomTransition from '../Shared/ZoomTransition';

const Wrapper = styled.div`
  .cont-min-height {
    min-height: 90vh;

    .overflow-y {
      overflow-y: auto;
    }

    .text-500 {
      font-weight: 500;
    }

    .s-text-label {
      color: #424242;
      font-size: 18px;
      text-decoration: underline;
    }

    .text-mini-label {
      font-weight: 600;
      color: #424242;
      font-size: 0.8rem;
    }

    .text-content {
      font-size: 1rem;
      color: #424242;
      font-weight: 500;
    }
  }

  .progressCircular {
    color: ${colors.grey[500]};
  }
`;

const SChip = styled(Chip)`
  &.top-priority {
    background-color: #ef5350;
  }
  background-color: #757575;
  color: #fff;
  font-weight: 500;
`;

const ReviewTicket = props => {
  const {
    auth: { authRoles },
    review: { selectedReview, reviewLoader },
    fetchSingleReview,
    updateReviewTicketForm,
    changeReviewStatus,
    updateReview,
  } = props;

  const { ticketId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [addNoteToCustomer, setNoteToCustomer] = React.useState(false);
  const [customersNote, setCustomersNote] = React.useState('');
  const [reviewersNote, setReviewersNote] = React.useState('');

  React.useEffect(() => {
    const fetchSingleReviewAsync = async () => {
      await fetchSingleReview({
        scope: '/claim_review_queues',
        fingerprint: ticketId,
      });
    };

    fetchSingleReviewAsync();
  }, [fetchSingleReview, ticketId]);

  const isAdminOrReviewer =
    authRoles.includes('admin') || authRoles.includes('reviewer');

  const isReviewed = () => {
    const {
      attributes: { status },
    } = selectedReview;
    return isEqual(status, 'ready for assessment');
  };

  const isBackToCustomer = () => {
    const {
      attributes: { status },
    } = selectedReview;
    return isEqual(status, 'back to customer');
  };

  const handleSubmit = urlTip => async () => {
    const formValues = isEqual(urlTip, 'back_to_customer')
      ? {
          notesToCustomer: isEmpty(customersNote)
            ? selectedReview.attributes.reviewer.notesToCustomer
            : customersNote,
        }
      : {
          reviewerNotes: isEmpty(reviewersNote)
            ? selectedReview.attributes.reviewer.notes
            : reviewersNote,
        };
    await changeReviewStatus(
      {
        scope: `/claim_review_queues/${selectedReview.id}/${urlTip}`,
        data: {
          ...formValues,
        },
      },
      enqueueSnackbar,
      () => {
        updateReviewTicketForm({ empty: true });
        history.push('/review-queue');
      },
    );
  };

  const handleChange = () => {
    setNoteToCustomer(!addNoteToCustomer);
  };

  const handleSaveNotesToCustomer = async value => {
    await setCustomersNote(value);
    await updateReview({
      scope: '/claim_review_queues',
      fingerprint: selectedReview.id,
      data: {
        notesToCustomer: value,
      },
    });
  };

  const handleSaveReviewerNotes = async value => {
    await setReviewersNote(value);
    await updateReview({
      scope: '/claim_review_queues',
      fingerprint: selectedReview.id,
      data: {
        reviewerNotes: value,
      },
    });
  };

  const timeOutSaveNoteToCustomer = debounce(handleSaveNotesToCustomer, 2000);
  const timeOutSaveReviewerNotes = debounce(handleSaveReviewerNotes, 2000);

  const handleChangeNotesToCustomer = e => {
    const {
      target: { value },
    } = e;
    timeOutSaveNoteToCustomer(value);
  };

  const handleChangeReviewerNotes = e => {
    const {
      target: { value },
    } = e;
    timeOutSaveReviewerNotes(value);
  };

  return (
    <Wrapper className="container-fluid mx-0">
      <div className="row">
        <div className="col-lg-4 col-12 h-100 overflow-y">
          {reviewLoader.fetch && (
            <div className="d-flex flex-column justify-content-center align-items-center cont-min-height">
              <CircularProgress size={50} />
            </div>
          )}
          {!reviewLoader.fetch && !isEmpty(selectedReview) && (
            <Paper elevation={0} className="w-100 cont-min-height p-2">
              <div className="d-flex flex-column">
                <p className="s-text-label text-600 pt-4 pb-3">
                  Claim Reference:{' '}
                  {selectedReview.attributes.claim.referenceNumber}
                </p>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="text-mini-label mb-1">Priority</p>
                  <SChip
                    className={`text-capitalize ${
                      selectedReview.attributes.priority ? 'top-priority' : ''
                    }`}
                    label={
                      selectedReview.attributes.priority ? 'high' : 'normal'
                    }
                  />
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned by</p>
                  <p className="mb-0 text-capitalize text-content">
                    {selectedReview.attributes.assigner.name}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned</p>
                  <p className="mb-0 text-content">
                    {utils.timeAgo(selectedReview.attributes.time.assigned)}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigner notes</p>
                  <p className="mb-0 text-content">
                    {selectedReview.attributes.assigner.notes}
                  </p>
                </div>
              </div>
              {isBackToCustomer() && (
                <DataContainer
                  label="Notes to customer"
                  value={selectedReview.attributes.reviewer.notesToCustomer}
                />
              )}

              <div className="py-3"></div>
              <Switch
                id="addNoteToCustomer"
                label="Add Note To Customer?"
                switchLabelPrimary="Yes"
                onChange={handleChange}
                checked={addNoteToCustomer}
              />

              {addNoteToCustomer && (
                <ZoomTransition animate={addNoteToCustomer}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div className="d-flex flex-column">
                      <TextField
                        id="notesToCustomer"
                        label={`Your notes to the Customer (${
                          reviewLoader.update ? 'saving...' : 'saved.'
                        })`}
                        variant="filled"
                        type="text"
                        rowsMax="8"
                        rows={7}
                        defaultValue={
                          selectedReview.attributes.reviewer.notesToCustomer ||
                          ''
                        }
                        onChange={handleChangeNotesToCustomer}
                        multiline
                        fullWidth
                      />
                    </div>
                  </div>
                </ZoomTransition>
              )}

              {!isReviewed() && isAdminOrReviewer ? (
                <div className="d-flex flex-column">
                  <TextField
                    id="reviewerNotes"
                    label={`Your notes (${
                      reviewLoader.update ? 'saving...' : 'saved.'
                    })`}
                    variant="filled"
                    type="text"
                    rowsMax="8"
                    rows={7}
                    defaultValue={
                      selectedReview.attributes.reviewer.notes || ''
                    }
                    onChange={handleChangeReviewerNotes}
                    multiline
                    fullWidth
                  />
                  <div className="pt-4 ">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={handleSubmit('back_to_customer')}
                      disabled={reviewLoader.submit}
                    >
                      {reviewLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!reviewLoader.submit && (
                        <span className="text-capitalize text-500 p-1">
                          back to customer
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSubmit('ready_for_assessment')}
                      disabled={reviewLoader.submit}
                    >
                      {reviewLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!reviewLoader.submit && (
                        <span className="text-capitalize text-500 p-1">
                          ready for assessment
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <DataContainer
                    label="Notes"
                    value={selectedReview.attributes.reviewer.notes}
                  />
                </div>
              )}

              {!isAdminOrReviewer && (
                <div>
                  <p className="text-mini-label text-center">
                    Your account is not allowed to update this ticket
                  </p>
                </div>
              )}
            </Paper>
          )}
        </div>
        <div className="col-lg-8 col-12 h-100 overflow-y">
          {!reviewLoader.fetch && !isEmpty(selectedReview) && (
            <SingleClaimTicketView />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

ReviewTicket.propTypes = {
  review: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  fetchSingleReview: PropTypes.func.isRequired,
  changeReviewStatus: PropTypes.func.isRequired,
  updateReviewTicketForm: PropTypes.func.isRequired,
  updateReview: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    review: state.review,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(ReviewTicket);
