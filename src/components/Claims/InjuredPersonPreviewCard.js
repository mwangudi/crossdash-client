import React from 'react';
import styled from 'styled-components';
import { Button, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { isEqual, toLower } from 'lodash';
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

const InjuredPersonPreviewCard = props => {
  const {
    injured: {
      id,
      firstName,
      lastName,
      surname,
      identificationNumber,
      isAdult,
      relationToClaimant,
      wasInVehicle,
      wasDriver,
      vehicleRegistrationNumber,
      identityType,
    },
    claim: { injuredPersonForm },
    manageInjuredPerson,
  } = props;

  const deleteInjuredPerson = () => {
    const { injured } = props;
    manageInjuredPerson({
      removeInjured: true,
      injured: {
        ...injured,
      },
    });
  };

  const editInjuredPerson = () => {
    const { injured } = props;
    manageInjuredPerson({
      editInjured: true,
      injured: {
        ...injured,
      },
    });
  };

  return (
    <Wrapper className="w-100 px-3 py-4 mb-3">
      <div className="d-flex flex-column align-items-left">
        <p className="mb-0 pt-1 pb-3 text-title text-capitalize">
          {lastName} {surname} {firstName}{' '}
        </p>
        <p className="mb-0 pt-2 pb-1">
          <span className="bolder">{lastName}</span> was injured
          {identityType &&
            `. ${firstName}'s ${toLower(
              identityType.attributes.name,
            )} is ${identificationNumber}.`}
          {!isAdult && ` and is under 18 years.`}
        </p>
        <p className="mb-0 pt-1">
          {isEqual('none', relationToClaimant) ? (
            `I am not related to ${lastName}.`
          ) : (
            <span>
              {lastName} is my{' '}
              <span className="bolder">{relationToClaimant}.</span>
            </span>
          )}
          {wasInVehicle &&
            !wasDriver &&
            ` ${lastName} was in vehicle ${vehicleRegistrationNumber}.`}
          {wasInVehicle &&
            wasDriver &&
            ` ${lastName} was the driver of vehicle ${vehicleRegistrationNumber}`}
        </p>
      </div>
      <div className="d-flex flex-column align-items-left">
        {injuredPersonForm.id !== id && (
          <div className="pt-3">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={deleteInjuredPerson}
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
              onClick={editInjuredPerson}
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

InjuredPersonPreviewCard.propTypes = {
  injured: PropTypes.object.isRequired,
  manageInjuredPerson: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(InjuredPersonPreviewCard);
