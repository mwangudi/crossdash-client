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
import { isEmpty, debounce, isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import actions from '../../store/rootActions';
import utils from '../../utils';
import TextField from '../Shared/TextField';
import SelectField from '../Shared/SelectField';
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

const FinanceTicket = props => {
  const {
    auth: { authRoles },
    finance: { selectedFinance, financeLoader },
    fetchSingleFinance,
    updateFinance,
    payClaim,
  } = props;
  const { ticketId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const paymentChannels = [
    {
      value: 'cash',
      title: 'Cash',
    },
    {
      value: 'cheque',
      title: 'Cheque',
    },
    {
      value: 'bank_transfer',
      title: 'Bank Transfer',
    },
    {
      value: 'mobile_money',
      title: 'Mobile Money',
    },
  ];

  React.useEffect(() => {
    const fetchAsync = async () => {
      await fetchSingleFinance({
        scope: '/claim_disbursement_queues',
        fingerprint: ticketId,
      });
    };

    fetchAsync();
  }, [fetchSingleFinance, ticketId]);

  const isAdminOrFinance =
    authRoles.includes('admin') || authRoles.includes('finance');

  const isNotPaid = () => {
    const {
      attributes: { status },
    } = selectedFinance;
    return !isEqual('paid', status);
  };

  const handleSubmit = async value => {
    await updateFinance({
      scope: '/claim_disbursement_queues',
      fingerprint: selectedFinance.id,
      data: {
        disbursementNotes: value,
      },
    });
  };

  const timeOutSave = debounce(handleSubmit, 2000);

  const handleChangeNotes = e => {
    const {
      target: { value },
    } = e;
    timeOutSave(value);
  };

  const goToQueue = () => {
    history.push(`/finance-queue`);
  };

  const handlePayClaim = async values => {
    await payClaim(
      {
        scope: `/claim_disbursement_queues/${selectedFinance.id}/paid_claim`,
        data: {
          ...values,
        },
      },
      enqueueSnackbar,
      goToQueue,
    );
  };

  const formik = useFormik({
    initialValues: {
      amountDisbursed: 0,
      disbursementChannel: '',
    },
    validationSchema: Yup.object().shape({
      amountDisbursed: Yup.number()
        .min(1, `You can't just pay nothing`)
        .required()
        .label('Amount disbursed'),
      disbursementChannel: Yup.string()
        .required()
        .label('Disbursement channel'),
    }),
    onSubmit: values => {
      handlePayClaim(values);
    },
  });

  const handleSelectChannel = field => e => {
    const {
      target: { value },
    } = e;
    formik.setFieldValue(field, value);
  };

  return (
    <Wrapper className="container-fluid mx-0">
      <div className="row">
        <div className="col-lg-4 col-12 h-100 overflow-y">
          {financeLoader.fetch && (
            <div className="d-flex flex-column justify-content-center align-items-center cont-min-height">
              <CircularProgress size={50} />
            </div>
          )}
          {!financeLoader.fetch && !isEmpty(selectedFinance) && (
            <Paper elevation={0} className="w-100 cont-min-height p-2">
              <div className="d-flex flex-column">
                <p className="s-text-label text-600 pt-4 pb-3">
                  Claim Reference:{' '}
                  {selectedFinance.attributes.claim.referenceNumber}
                </p>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="text-mini-label mb-1">Priority</p>
                  <SChip
                    className={`text-capitalize ${
                      selectedFinance.attributes.priority ? 'top-priority' : ''
                    }`}
                    label={
                      selectedFinance.attributes.priority ? 'high' : 'normal'
                    }
                  />
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned by</p>
                  <p className="mb-0 text-capitalize text-content">
                    {selectedFinance.attributes.assigner.name}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigned</p>
                  <p className="mb-0 text-content">
                    {utils.timeAgo(selectedFinance.attributes.time.assigned)}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start pb-2">
                  <p className="mb-1 text-mini-label">Assigner notes</p>
                  <p className="mb-0 text-content">
                    {selectedFinance.attributes.assigner.notes}
                  </p>
                </div>
              </div>

              <div className="py-3"></div>

              {isNotPaid() && isAdminOrFinance ? (
                <div className="d-flex flex-column">
                  <TextField
                    id="notes"
                    label={`Your notes (${
                      financeLoader.update ? 'saving....' : 'saved.'
                    })`}
                    variant="filled"
                    type="text"
                    rowsMax="8"
                    rows={7}
                    defaultValue={
                      selectedFinance.attributes.finance.notes || ''
                    }
                    onChange={handleChangeNotes}
                    multiline
                    fullWidth
                  />
                  <SelectField
                    id="disbursementChannel"
                    label="Payment Channel"
                    variant="filled"
                    type="text"
                    options={paymentChannels}
                    onChange={handleSelectChannel('disbursementChannel')}
                    value={formik.values.disbursementChannel}
                    error={
                      formik.touched.disbursementChannel &&
                      !!formik.errors.disbursementChannel
                    }
                    helperText={formik.errors.disbursementChannel}
                    fullWidth
                    displayEmpty
                  />
                  <TextField
                    id="amountDisbursed"
                    label="Amount disbursed"
                    variant="filled"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.amountDisbursed}
                    error={
                      formik.touched.amountDisbursed &&
                      !!formik.errors.amountDisbursed
                    }
                    helperText={formik.errors.amountDisbursed}
                    fullWidth
                  />
                  <div className="pt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={financeLoader.submit}
                      onClick={formik.handleSubmit}
                    >
                      {financeLoader.submit && (
                        <div className="d-flex flex-row align-items-center">
                          <span className="pr-2">Processing</span>
                          <CircularProgress
                            size={25}
                            className="progressCircular"
                          />
                        </div>
                      )}
                      {!financeLoader.submit && (
                        <span className="text-capitalize text-500 px-3 py-1">
                          Pay
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <DataContainer
                    label="Amount disbursed"
                    value={utils.addCommasToNumbers(
                      selectedFinance.attributes.finance.amountDisbursed,
                    )}
                  />
                  <DataContainer
                    label="Disbursement channel"
                    value={
                      selectedFinance.attributes.finance.disbursementChannel
                    }
                  />
                  <DataContainer
                    label="Notes"
                    value={selectedFinance.attributes.finance.notes}
                  />
                </div>
              )}
              {!isAdminOrFinance && (
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
          {!financeLoader.fetch && !isEmpty(selectedFinance) && (
            <SingleClaimTicketView />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

FinanceTicket.propTypes = {
  finance: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  fetchSingleFinance: PropTypes.func.isRequired,
  updateFinance: PropTypes.func.isRequired,
  payClaim: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    finance: state.finance,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(FinanceTicket);
