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

const VehicleDamagesPreviewCard = props => {
  const {
    damage,
    claim: { vehicleDamagesForm },
    manageVehicleDamage,
  } = props;

  const deleteDamage = () => {
    manageVehicleDamage({
      removeDamages: true,
      vehicleDamage: {
        ...damage,
      },
    });
  };

  const editDamage = () => {
    manageVehicleDamage({
      editDamage: true,
      vehicleDamage: {
        ...damage,
      },
    });
  };

  return (
    <Wrapper className="w-100 px-3 py-4 mb-3">
      <div className="d-flex flex-column align-items-left">
        <p className="mb-0 pt-1 pb-3 text-title text-capitalize">
          Estimated Repair Cost {damage.estimatedRepairCost.toLocaleString()}
        </p>
        <p className="mb-0 pt-2 pb-1">
          Damaged section: <span className="font italic">{damage.damage}</span>
        </p>
        <p className="mb-0 pt-1">Proposed repairs: {damage.repairDetails}</p>
      </div>
      <div className="d-flex flex-column align-items-left">
        {vehicleDamagesForm.id !== damage.id && (
          <div className="pt-3">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={deleteDamage}
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
              onClick={editDamage}
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

VehicleDamagesPreviewCard.propTypes = {
  damage: PropTypes.object.isRequired,
  manageVehicleDamage: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, actions)(VehicleDamagesPreviewCard);
