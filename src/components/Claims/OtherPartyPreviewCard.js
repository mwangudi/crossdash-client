import React from 'react';
import styled from 'styled-components';
import { Paper, Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { toLower } from 'lodash';
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

const OtherPartyPreview = props => {
  const {
    otherParty: {
      id,
      firstName,
      lastName,
      surname,
      identificationNumber,
      insurerPolicyNumber,
      insurer,
      vehicleDamages,
      vehicleRegistrationNumber,
      identityType,
    },
    claim: { otherPartyForm },
    manageOtherParty,
  } = props;

  const deleteOtherParty = () => {
    const { otherParty } = props;
    manageOtherParty({
      removeOtherParty: true,
      otherParty: {
        ...otherParty,
      },
    });
  };

  const editOtherParty = () => {
    const { otherParty } = props;
    manageOtherParty({
      editOtherParty: true,
      otherParty: {
        ...otherParty,
      },
    });
  };

  return (
    <Wrapper className="w-100 px-3 py-4 mb-3">
      <div className="d-flex flex-column align-items-left">
        <p className="mb-0 pt-1 pb-3 text-title">{vehicleRegistrationNumber}</p>
        <p className="mb-0 pt-2 pb-1">
          The owner of this vehicle is{' '}
          <span className="bolder">{lastName}</span> {firstName}{' '}
          {surname && surname}.
          {identityType &&
            ` ${lastName}'s ${toLower(
              identityType.attributes.name,
            )} is ${identificationNumber}.`}
        </p>
        {insurer && (
          <p className="mb-0 pt-1 pb-3">
            {lastName} has an active policy with{' '}
            <span className="bolder">{insurer}</span>{' '}
            {insurerPolicyNumber && (
              <span>
                policy number{' '}
                <span className="bolder">{insurerPolicyNumber}</span>
              </span>
            )}
            .
          </p>
        )}
        <p className="mb-0 pt-1">
          Damages include: <span className="font-italic">{vehicleDamages}</span>
        </p>
      </div>
      <div className="d-flex flex-column align-items-left">
        {otherPartyForm.id !== id && (
          <div className="pt-3">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={deleteOtherParty}
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
              onClick={editOtherParty}
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

OtherPartyPreview.propTypes = {
  otherParty: PropTypes.object.isRequired,
  manageOtherParty: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(OtherPartyPreview);
