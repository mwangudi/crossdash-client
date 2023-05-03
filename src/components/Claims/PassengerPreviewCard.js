import React from 'react';
import styled from 'styled-components';
import { Paper, Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../store/rootActions';

const Wrapper = styled(Paper)`
  p {
    font-weight: 500;
  }

  .text-title {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .bolder {
    font-weight: 600;
  }
`;

const PassengersPreviewCard = props => {
  const {
    passenger: {
      id,
      firstName,
      lastName,
      surname,
      phoneNumber,
      isAdult,
      address,
    },
    claim: { passengerForm },
    managePassengers,
  } = props;

  const deletePassenger = () => {
    const { passenger } = props;
    managePassengers({
      removePassenger: true,
      passenger: {
        ...passenger,
      },
    });
  };

  const editPassanger = () => {
    const { passenger } = props;
    managePassengers({
      editPassanger: true,
      passenger: {
        ...passenger,
      },
    });
  };

  return (
    <Wrapper className="w-100 px-3 py-4 mb-3">
      <div className="d-flex flex-column align-items-left">
        <p className="mb-0 pt-1 pb-3 text-title text-capitalize">
          {lastName} {firstName}{' '}
        </p>
        <p className="mb-0 pt-2 pb-1">
          Passenger was <span className="bolder">{lastName}</span> {firstName}{' '}
          {surname && surname}. You can call {lastName} on{' '}
          <span className="bolder">{phoneNumber}</span>.
        </p>
        <p className="mb-0 pt-1">
          {lastName} is{' '}
          <span className="bolder">
            {isAdult ? 'above 18 years old' : 'under 18 years'}
          </span>{' '}
          {address && `and can be reached at this address ${address}`}
        </p>
      </div>
      <div className="d-flex flex-column align-items-left">
        {passengerForm.id !== id && (
          <div className="pt-3">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={deletePassenger}
            >
              <Typography
                variant="subtitle2"
                className="text-capitalize text-600"
              >
                delete
              </Typography>
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={editPassanger}
            >
              <Typography
                variant="subtitle2"
                className="text-capitalize text-600"
              >
                edit
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

PassengersPreviewCard.propTypes = {
  passenger: PropTypes.object.isRequired,
  managePassengers: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(PassengersPreviewCard);
