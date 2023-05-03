import React from 'react';
import { Stepper, Step, StepButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  .stepper {
    background-color: transparent;
    padding: 0px;

    .stepLabel {
      outline: none;

      .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
        margin-top: 8px;
      }
    }
  }
`;

const ButtonStepper = props => {
  const { steps, activeStep, handleStep } = props;
  return (
    <Div className="w-100 pb-2">
      <Stepper
        nonLinear
        activeStep={activeStep}
        alternativeLabel
        className="stepper"
      >
        {steps.map((step, i) => (
          <Step key={step.title}>
            <StepButton className="stepLabel" onClick={() => handleStep(i)}>
              {step.title}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Div>
  );
};

ButtonStepper.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  handleStep: PropTypes.func.isRequired,
};

export default ButtonStepper;
