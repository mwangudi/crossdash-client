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
import UploadField from '../Shared/UploadField';

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

const AssessmentTicket = props => {
  const {
    auth: { authRoles },
    assess: { selectedAssessment, assessLoader },
    fetchSingleAssessment,
    changeAssessmentStatus,
    updateAssessmentTicket,
    uploadAssessmentReport,
  } = props;
  const { ticketId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [assessorsNote, setAssessorsNote] = React.useState('');

  React.useEffect(() => {
    const fetchSingleAssessmentAsync = async () => {
      await fetchSingleAssessment({
        scope: '/claim_assessment_queues',
        fingerprint: ticketId,
      });
    };

    fetchSingleAssessmentAsync();
  }, [fetchSingleAssessment, ticketId]);

  const isAdminOrAssessor =
    authRoles.includes('admin') || authRoles.includes('assessor');

  const isAssessed = () => {
    const {
      attributes: { status },
    } = selectedAssessment;
    return isEqual(status, 'ready for approval');
  };

  const handleSubmitNote = async value => {
    await setAssessorsNote(value);
    await updateAssessmentTicket({
      scope: '/claim_assessment_queues',
      fingerprint: selectedAssessment.id,
      data: {
        assessmentNotes: value,
      },
    });
  };

  const timeOutSave = debounce(handleSubmitNote, 2000);

  const handleChangeNotes = e => {
    const {
      target: { value },
    } = e;
    timeOutSave(value);
  };

  const handleSaveClaimCosts = async value => {
    await updateAssessmentTicket({
      scope: '/claim_assessment_queues',
      fingerprint: selectedAssessment.id,
      data: {
        claimCost: value,
      },
    });
  };

  const timeOutSaveClaimCost = debounce(handleSaveClaimCosts, 2000);
  const handleChangeSaveClaims = e => {
    const {
      target: { value },
    } = e;
    timeOutSaveClaimCost(value);
  };

  const handleSubmit = async () => {
    await changeAssessmentStatus(
      {
        scope: `/claim_assessment_queues/${selectedAssessment.id}/ready_for_approval`,
        data: {
          assessmentNotes: isEmpty(assessorsNote)
            ? selectedAssessment.attributes.assessor.notes
            : assessorsNote,
        },
      },
      enqueueSnackbar,
      () => {
        history.push('/assessment-queue');
      },
    );
  };

  const handleUploadReport = async files => {
    if (!isEmpty(files)) {
      await uploadAssessmentReport({
        scope: '/claim_assessment_queues',
        fingerprint: selectedAssessment.id,
        data: {
          files,
        },
      });
    }
  };

  return (
    <Wrapper className="container-fluid mx-0">
      <div className="row">
        <div className="col-lg-4 col-12 h-100 overflow-y">
          {assessLoader.fetch && (
            <div className="d-flex flex-column justify-content-center align-items-center cont-min-height">
              <CircularProgress size={50} />
            </div>
          )}
          {!assessLoader.fetch && !isEmpty(selectedAssessment) && (
            <Paper elevation={0} className="w-100 cont-min-height p-2">
              <div className="d-flex flex-column">
                <p className="s-text-label text-600 pt-4 pb-3">
                  Claim Reference:{' '}
                  {selectedAssessment.attributes.claim.referenceNumber}
                </p>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="text-mini-label mb-1">Priority</p>
                  <SChip
                    className={`text - capitalize ${
                      selectedAssessment.attributes.priority
                        ? 'top-priority'
                        : ''
                    }`}
                    label={
                      selectedAssessment.attributes.priority ? 'high' : 'normal'
                    }
                  />
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned by</p>
                  <p className="mb-0 text-capitalize text-content">
                    {selectedAssessment.attributes.assigner.name}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned</p>
                  <p className="mb-0 text-content">
                    {utils.timeAgo(selectedAssessment.attributes.time.assigned)}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigner notes</p>
                  <p className="mb-0 text-content">
                    {selectedAssessment.attributes.assigner.notes}
                  </p>
                </div>
              </div>

              <div className="py-3"></div>

              {!isAssessed() && isAdminOrAssessor ? (
                <div className="d-flex flex-column">
                  <TextField
                    id="assessmentNotes"
                    label={`Your notes (${
                      assessLoader.update ? 'saving....' : 'saved.'
                    })`}
                    variant="filled"
                    type="text"
                    rowsMax="8"
                    rows={7}
                    defaultValue={
                      selectedAssessment.attributes.assessor.notes || ''
                    }
                    onChange={handleChangeNotes}
                    multiline
                    fullWidth
                  />
                  <TextField
                    id="claimCost"
                    label={`Claim Cost (${
                      assessLoader.update ? 'saving...' : 'saved.'
                    })`}
                    variant="filled"
                    type="number"
                    rowsMax="1"
                    rows={7}
                    defaultValue={
                      selectedAssessment.attributes.assessor.claimCosts || 0
                    }
                    onChange={handleChangeSaveClaims}
                    fullWidth
                  />
                  <UploadField
                    label="Upload Assessment Report (pdf)"
                    filesLimit={1}
                    initialFiles={[]}
                    acceptedFiles={['application/pdf']}
                    handleChange={files => handleUploadReport(files)}
                  />
                  <div className="pt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={
                        assessLoader.submit ||
                        isAssessed(selectedAssessment.attributes.status)
                      }
                      onClick={handleSubmit}
                    >
                      {assessLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!assessLoader.submit && (
                        <span className="text-capitalize text-500 p-1">
                          Ready for approval
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <DataContainer
                    label="Approval recommendations"
                    value={
                      selectedAssessment.attributes.assessor
                        .approvalRecommendations
                    }
                  />
                  <DataContainer
                    label="Notes"
                    value={selectedAssessment.attributes.assessor.notes}
                  />
                  <DataContainer
                    label="Claim cost"
                    value={utils.addCommasToNumbers(
                      selectedAssessment.attributes.assessor.claimCost,
                    )}
                  />
                </div>
              )}
              {!isAdminOrAssessor && (
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
          {!assessLoader.fetch && !isEmpty(selectedAssessment) && (
            <SingleClaimTicketView />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

AssessmentTicket.propTypes = {
  assess: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  fetchSingleAssessment: PropTypes.func.isRequired,
  changeAssessmentStatus: PropTypes.func.isRequired,
  updateAssessmentTicket: PropTypes.func.isRequired,
  uploadAssessmentReport: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    assess: state.assess,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(AssessmentTicket);
