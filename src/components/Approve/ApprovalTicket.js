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
import { isEmpty, split } from 'lodash';
import { useSnackbar } from 'notistack';

import actions from '../../store/rootActions';
import utils from '../../utils';
import TextField from '../Shared/TextField';
import SingleClaimTicketView from './SingleClaimTicketView';
import DataContainer from '../Shared/DataContainer';

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

const ApprovalTicket = props => {
  const {
    auth: { authRoles },
    approve: { selectedApproval, approvalLoader, approvalTicketForm },
    fetchSingleApproval,
    updateApprovalTicketForm,
    changeApprovalStatus,
  } = props;

  const { ticketId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  React.useEffect(() => {
    const fetchSingleApprovalAsync = async () => {
      await fetchSingleApproval({
        scope: '/claim_assessment_queues',
        fingerprint: ticketId,
      });
    };

    fetchSingleApprovalAsync();
  }, [fetchSingleApproval, ticketId]);

  const canApprove =
    authRoles.includes('admin') || authRoles.includes('approver');

  const handleChangeNotes = e => {
    const {
      target: { value },
    } = e;

    updateApprovalTicketForm({
      ...approvalTicketForm,
      approvalNotes: value,
    });
  };

  const handleSubmit = urlTip => async () => {
    const claimId = split(selectedApproval.links.claim, '/')[2];
    await changeApprovalStatus(
      {
        scope: `/claim_approval_queues/${urlTip}`,
        data: {
          ...approvalTicketForm,
          assessedTicketId: selectedApproval.id,
          claimId,
        },
      },
      enqueueSnackbar,
      () => {
        updateApprovalTicketForm({ empty: true });
        history.push('/approval-queue');
      },
    );
  };

  return (
    <Wrapper className="container-fluid mx-0">
      <div className="row">
        <div className="col-lg-4 col-12 h-100 overflow-y">
          {approvalLoader.fetch && (
            <div className="d-flex flex-column justify-content-center align-items-center cont-min-height">
              <CircularProgress size={50} />
            </div>
          )}
          {!approvalLoader.fetch && !isEmpty(selectedApproval) && (
            <Paper elevation={0} className="w-100 cont-min-height p-2">
              <div className="d-flex flex-column">
                <p className="s-text-label text-600 pt-4 pb-3">
                  Claim Reference:{' '}
                  {selectedApproval.attributes.claim.referenceNumber}
                </p>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="text-mini-label mb-1">Priority</p>
                  <SChip
                    className={`text-capitalize ${
                      selectedApproval.attributes.priority ? 'top-priority' : ''
                    }`}
                    label={
                      selectedApproval.attributes.priority ? 'high' : 'normal'
                    }
                  />
                </div>
                <DataContainer
                  label="Assigned by"
                  value={selectedApproval.attributes.assigner.name}
                />
                <DataContainer
                  label="Assigned"
                  value={selectedApproval.attributes.time.assigned}
                  formatter={utils.timeAgo}
                />
                <DataContainer
                  label="Assigner notes"
                  value={selectedApproval.attributes.assigner.notes}
                />
                <DataContainer
                  label="Assessor notes"
                  value={selectedApproval.attributes.assessor.notes}
                />
                <DataContainer
                  label="Claim cost"
                  value={utils.addCommasToNumbers(
                    selectedApproval.attributes.assessor.claimCost,
                  )}
                />
              </div>

              <div className="py-3"></div>

              {canApprove ? (
                <div className="d-flex flex-column">
                  <TextField
                    id="reviewerNotes"
                    label="Your Notes"
                    variant="filled"
                    type="text"
                    rowsMax="8"
                    rows={7}
                    value={approvalTicketForm.approvalNotes}
                    onChange={handleChangeNotes}
                    multiline
                    fullWidth
                  />
                  <div className="pt-4">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      disabled={approvalLoader.submit}
                      onClick={handleSubmit('reject_claim')}
                    >
                      {approvalLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!approvalLoader.submit && (
                        <span className="text-capitalize text-500 px-2 py-1">
                          reject
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={approvalLoader.submit}
                      onClick={handleSubmit('approve_claim')}
                    >
                      {approvalLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!approvalLoader.submit && (
                        <span className="text-capitalize text-500 px-2 py-1">
                          Approve
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
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
          {!approvalLoader.fetch && !isEmpty(selectedApproval) && (
            <SingleClaimTicketView />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

ApprovalTicket.propTypes = {
  approve: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  fetchSingleApproval: PropTypes.func.isRequired,
  changeApprovalStatus: PropTypes.func.isRequired,
  updateApprovalTicketForm: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    approve: state.approve,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(ApprovalTicket);
