import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import PropTypes from 'prop-types';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import styled from 'styled-components';

const Div = styled.div`
  .stepper {
    background-color: transparent;
    padding: 0px;

    .stepLabel {
      .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
        margin-top: 8px;
      }
    }
  }
`;

const CustomStepper = props => {
  const { steps, activeStep } = props;
  return (
    <Div className="w-100 pb-2">
      <Stepper activeStep={activeStep} alternativeLabel className="stepper">
        {steps.map(step => (
          <Step key={step.title}>
            <StepLabel className="stepLabel">{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Div>
  );
};

CustomStepper.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default CustomStepper;
