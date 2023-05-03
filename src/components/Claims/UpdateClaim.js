import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, CircularProgress, colors } from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_navigate_next as icNext } from 'react-icons-kit/md/ic_navigate_next';
import { ic_navigate_before as icBack } from 'react-icons-kit/md/ic_navigate_before';
import { ic_fast_forward as icFastFwd } from 'react-icons-kit/md/ic_fast_forward';
import { isEmpty, isEqual, words } from 'lodash';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ic_refresh as icRefresh } from 'react-icons-kit/md/ic_refresh';

import actions from '../../store/rootActions';
import DriverDetails from './DriverDetailsForm';
import ButtonStepper from '../Shared/ButtonStepper';
import AccidentForm from './AccidentDetailsForm';
import OtherPartyForm from './OtherPartyForm';
import PoliceForm from './PoliceDetailsForm';
import PassengerForm from './PassengerForm';
import WitnessForm from './WitnessDetailsForm';
import InjuredPersonForm from './InjuredPersonForm';
import ClaimantStatement from './ClaimantStatement';
import VehicleDamages from './VehicleDamages';

const Wrapper = styled.div`
  .custButton {
    padding: 11px 16px;
  }

  .progressCircular {
    color: ${colors.grey[500]};
  }

  @media (min-width: 1200px) {
    .container,
    .container-lg,
    .container-md,
    .container-sm,
    .container-xl {
      max-width: 1500px;
    }
  }
`;

const DisplayForm = props => {
  const {
    values: {
      stepVal,
      accidentForm,
      driverForm,
      policeForm,
      otherPartyForm,
      passengerForm,
      witnessForm,
      injuredPersonForm,
      vehicleDamagesForm,
      manageOtherParty,
      managePassengers,
      manageWitness,
      manageInjuredPerson,
      manageVehicleDamage,
      handleSubmit,
      setFormId,
    },
  } = props;

  const handler = handleSubmit(stepVal);
  const id = setFormId(stepVal);
  switch (stepVal) {
    case 0:
      return <DriverDetails id={id} form={driverForm} handleSubmit={handler} />;
    case 1:
      return <ClaimantStatement />;
    case 2:
      return (
        <AccidentForm id={id} form={accidentForm} handleSubmit={handler} />
      );
    case 3:
      return (
        <VehicleDamages
          id={id}
          form={vehicleDamagesForm}
          handleSubmit={payload =>
            manageVehicleDamage({
              newDamages: true,
              vehicleDamage: {
                ...payload,
              },
            })
          }
        />
      );
    case 4:
      return <PoliceForm id={id} form={policeForm} handleSubmit={handler} />;
    case 5:
      return (
        <InjuredPersonForm
          id={id}
          form={injuredPersonForm}
          handleSubmit={payload =>
            manageInjuredPerson({
              newInjured: true,
              injured: {
                ...payload,
              },
            })
          }
        />
      );
    case 6:
      return (
        <OtherPartyForm
          id={id}
          form={otherPartyForm}
          handleSubmit={payload =>
            manageOtherParty({
              newOtherParty: true,
              otherParty: {
                ...payload,
              },
            })
          }
        />
      );
    case 7:
      return (
        <WitnessForm
          id={id}
          form={witnessForm}
          handleSubmit={payload =>
            manageWitness({
              newWitness: true,
              witness: {
                ...payload,
              },
            })
          }
        />
      );
    case 8:
      return (
        <PassengerForm
          id={id}
          form={passengerForm}
          handleSubmit={payload =>
            managePassengers({
              newPassenger: true,
              passenger: {
                ...payload,
              },
            })
          }
        />
      );
    default:
      return null;
  }
};

DisplayForm.propTypes = {
  values: PropTypes.object.isRequired,
};

const FileNewClaim = props => {
  const [activeStep, setActiveStep] = React.useState(0);
  const {
    claim: {
      steps,
      accidentForm,
      driverForm,
      policeForm,
      otherPartyForm,
      passengerForm,
      witnessForm,
      injuredPersonForm,
      vehicleDamagesForm,
      passengers,
      otherParties,
      witnesses,
      injuredPeople,
      vehicleDamages,
      claimsLoader,
      selectedClaim,
    },
    updateAccidentForm,
    updateDriverForm,
    updatedPoliceDetailsForm,
    manageOtherParty,
    managePassengers,
    manageWitness,
    manageInjuredPerson,
    manageVehicleDamage,
    updateClaim,
    clearEmptyClaimsForm,
    populateVehicleDamageDetails,
    populateOtherParties,
    populateWitnesses,
    populateInjuredPersons,
    populatePassengers,
    updateClaimantStatement,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  React.useEffect(() => {
    const updateForms = () => {
      const splitNames = name => {
        const names = words(name);
        const [firstName, lastName = '', surname = ''] = names;
        return {
          firstName,
          lastName,
          surname,
        };
      };
      const {
        attributes: {
          driverDetails,
          accidentDetails,
          vehicleDamageDetails,
          policeDetails,
          passengerDetails,
          witnessDetails,
          otherPartyDetails,
          injuredPersonDetails,
        },
      } = selectedClaim;
      updateClaimantStatement({
        empty: true,
      });
      updateDriverForm({
        ...driverDetails,
        driverStatement: [],
        convictionDetails: [],
      });
      updateAccidentForm({
        ...accidentDetails,
        visibilityDuringAccident: !isEqual(
          accidentDetails.visibilityDuringAccident,
          'false',
        ),
        accidentSketch: [],
        accidentPhotos: [],
      });
      populateVehicleDamageDetails([...vehicleDamageDetails]);
      updatedPoliceDetailsForm({
        ...policeDetails,
        noticeOfProsecution: [],
      });
      populateOtherParties([
        ...otherPartyDetails.map(o => {
          const user = {
            ...o,
            ...splitNames(o.name),
          };
          return user;
        }),
      ]);
      populateWitnesses([
        ...witnessDetails.map(w => {
          const user = {
            ...w,
            ...splitNames(w.name),
          };
          return user;
        }),
      ]);
      populateInjuredPersons([
        ...injuredPersonDetails.map(inj => {
          const user = {
            ...inj,
            ...splitNames(inj.name),
          };
          return user;
        }),
      ]);
      populatePassengers([
        ...passengerDetails.map(p => {
          const user = {
            ...p,
            ...splitNames(p.name),
          };
          return user;
        }),
      ]);
    };

    updateForms();
  }, [
    selectedClaim,
    updateDriverForm,
    updateAccidentForm,
    populateVehicleDamageDetails,
    updatedPoliceDetailsForm,
    populateOtherParties,
    populateWitnesses,
    populateInjuredPersons,
    populatePassengers,
    updateClaimantStatement,
  ]);

  const updateStepper = stepVal => {
    setActiveStep(stepVal);
  };

  const nextStep = stepVal => {
    if (stepVal >= steps.length - 1) {
      return;
    }
    updateStepper(stepVal + 1);
  };

  const prevStep = stepVal => {
    if (stepVal <= 0) {
      return;
    }
    updateStepper(stepVal - 1);
  };

  const handleSubmitClaim = () => {
    updateClaim(
      {
        scope: '/claims',
        fingerprint: selectedClaim.id,
      },
      enqueueSnackbar,
      () => history.push('/customers'),
    );
  };

  const handleSubmit = stepVal => payload => {
    switch (stepVal) {
      case 0:
        updateDriverForm(payload);
        break;
      case 2:
        updateAccidentForm(payload);
        break;
      case 4:
        updatedPoliceDetailsForm(payload);
        break;
      default:
        break;
    }
    nextStep(stepVal);
  };

  const handlePrevious = () => {
    prevStep(activeStep);
  };

  const handleSkip = stepVal => () => nextStep(stepVal);

  const setFormId = stepVal => {
    let id = '';
    switch (stepVal) {
      case 0:
        id = 'driverForm';
        break;
      case 2:
        id = 'accidentForm';
        break;
      case 4:
        id = 'policeForm';
        break;
      default:
        break;
    }
    return id;
  };

  const skippableStep = stepVal => steps[stepVal].skip;

  const disableButton = stepVal => {
    let disabled = false;
    switch (stepVal) {
      case 3:
        disabled = isEmpty(vehicleDamages);
        break;
      case 5:
        disabled = isEmpty(injuredPeople);
        break;
      case 6:
        disabled = isEmpty(otherParties);
        break;
      case 7:
        disabled = isEmpty(witnesses);
        break;
      case 8:
        disabled = isEmpty(passengers);
        break;
      default:
        break;
    }
    return disabled;
  };

  const handleReset = () => {
    clearEmptyClaimsForm();
    history.push(0);
  };

  return (
    <Wrapper className="container">
      <div className="row">
        <div className="col-12 pt-4">
          <ButtonStepper
            handleStep={updateStepper}
            activeStep={activeStep}
            steps={steps}
          />
          <DisplayForm
            values={{
              stepVal: activeStep,
              accidentForm,
              driverForm,
              policeForm,
              otherPartyForm,
              passengerForm,
              witnessForm,
              injuredPersonForm,
              vehicleDamagesForm,
              manageOtherParty,
              managePassengers,
              manageWitness,
              manageInjuredPerson,
              manageVehicleDamage,
              handleSubmit,
              setFormId,
            }}
          />
        </div>
        <div className="col-12">
          <div className="d-flex flex-row align-items-center justify-content-between pb-4">
            {activeStep > 0 && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<Icon size={24} icon={icBack} />}
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            {isEqual(activeStep, 0) && (
              <Button
                variant="contained"
                disableElevation
                onClick={handleReset}
                startIcon={<Icon size={24} icon={icRefresh} />}
              >
                Reset Form
              </Button>
            )}

            {activeStep !== steps.length - 1 && (
              <div className="d-flex flex-row align-items-center">
                {skippableStep(activeStep) && (
                  <>
                    <Button
                      endIcon={<Icon size={24} icon={icFastFwd} />}
                      variant="outlined"
                      color="primary"
                      disableElevation
                      onClick={handleSkip(activeStep)}
                    >
                      Skip
                    </Button>
                    <Button
                      endIcon={<Icon size={24} icon={icNext} />}
                      variant="contained"
                      color="primary"
                      disableElevation
                      disabled={disableButton(activeStep)}
                      onClick={handleSkip(activeStep)}
                    >
                      Next
                    </Button>
                  </>
                )}
                {!skippableStep(activeStep) && (
                  <Button
                    endIcon={<Icon size={24} icon={icNext} />}
                    variant="contained"
                    color="primary"
                    disableElevation
                    type="submit"
                    form={setFormId(activeStep)}
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                className="custButton"
                variant="contained"
                color="primary"
                onClick={handleSubmitClaim}
                disabled={claimsLoader.submit}
                disableElevation
              >
                {!claimsLoader.submit ? (
                  'Submit Claim'
                ) : (
                  <div className="d-flex flex-row align-items-center">
                    <span className="pr-2">Processing</span>
                    <CircularProgress size={25} className="progressCircular" />
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

FileNewClaim.propTypes = {
  claim: PropTypes.object.isRequired,
  updateAccidentForm: PropTypes.func.isRequired,
  updateDriverForm: PropTypes.func.isRequired,
  manageOtherParty: PropTypes.func.isRequired,
  managePassengers: PropTypes.func.isRequired,
  manageWitness: PropTypes.func.isRequired,
  updatedPoliceDetailsForm: PropTypes.func.isRequired,
  manageInjuredPerson: PropTypes.func.isRequired,
  manageVehicleDamage: PropTypes.func.isRequired,
  updateClaim: PropTypes.func.isRequired,
  clearEmptyClaimsForm: PropTypes.func.isRequired,
  populateVehicleDamageDetails: PropTypes.func.isRequired,
  populateOtherParties: PropTypes.func.isRequired,
  populateWitnesses: PropTypes.func.isRequired,
  populateInjuredPersons: PropTypes.func.isRequired,
  populatePassengers: PropTypes.func.isRequired,
  updateClaimantStatement: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(FileNewClaim);
