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

const WitnessPreviewCard = props => {
  const {
    witness: { id, firstName, lastName, surName, phoneNumber, isAdult },
    claim: { witnessForm },
    manageWitness,
  } = props;

  const deleteWitness = () => {
    const { witness } = props;
    manageWitness({
      removeWitness: true,
      witness: {
        ...witness,
      },
    });
  };

  const editWitness = () => {
    const { witness } = props;
    manageWitness({
      editWitness: true,
      witness: {
        ...witness,
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
          Accident was witnessed by <span className="bolder">{lastName}</span>{' '}
          {firstName} {surName && surName}. You can call {lastName} on{' '}
          <span className="bolder">{phoneNumber}</span>.
        </p>
        <p className="mb-0 pt-1">
          {lastName} is{' '}
          <span className="bolder">
            {isAdult ? 'above 18 years old' : 'under 18 years'}
          </span>{' '}
        </p>
      </div>
      <div className="d-flex flex-column align-items-left">
        {witnessForm.id !== id && (
          <div className="pt-3">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={deleteWitness}
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
              onClick={editWitness}
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

WitnessPreviewCard.propTypes = {
  witness: PropTypes.object.isRequired,
  manageWitness: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(WitnessPreviewCard);
