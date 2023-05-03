import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper, Button } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import uuid from 'uuid-random';
import TextField from '../Shared/TextField';
import actions from '../../store/rootActions';
import VehicleDamagesPreview from './VehicleDamagesPreview';

const Wrapper = styled(Paper)`
  .content-preview {
    max-height: 540px;
    overflow-y: auto;
  }
`;

const Form = props => {
  const {
    id,
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    claim: { vehicleDamages },
  } = props;

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Vehicle Damages</h6>
      <hr />
      <form id={id} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <TextField
              id="damage"
              label="Damage Done"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.damage}
              error={!!errors.damage || touched.damage}
              helperText={errors.damage}
              autoFocus
            />
            <TextField
              id="estimatedRepairCost"
              label="Estimated Repair Cost"
              variant="filled"
              type="number"
              fullWidth
              onChange={handleChange}
              value={values.estimatedRepairCost}
              error={
                !!errors.estimatedRepairCost || touched.estimatedRepairCost
              }
              helperText={errors.estimatedRepairCost}
            />
            <TextField
              id="repairDetails"
              label="Repair details"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.repairDetails}
              error={!!errors.repairDetails || touched.repairDetails}
              helperText={errors.repairDetails}
            />
            <div className="pt-4">
              <Button
                type="submit"
                color="primary"
                disableElevation
                variant="contained"
              >
                Add
              </Button>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="row p-3 content-preview">
              {React.Children.toArray(
                vehicleDamages.map(damage => (
                  <VehicleDamagesPreview damage={damage} />
                )),
              )}
            </div>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

Form.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

const FormikEnhancer = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    damage: Yup.string()
      .required()
      .label('Damage Summary'),
    estimatedRepairCost: Yup.number()
      .min(1, `Repairs are free?`)
      .required()
      .label('Estimated Repair Cost'),
    repairDetails: Yup.string()
      .required()
      .label('Repair Details'),
  }),
  mapPropsToValues: ({ form }) => ({
    ...form,
  }),

  handleSubmit: (payload, bag) => {
    const {
      props: { handleSubmit },
      resetForm,
    } = bag;
    handleSubmit({
      ...payload,
      id: payload.id || uuid(),
    });
    resetForm();
  },
  displayName: 'Vehicle Damages Details',
});

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps, actions)(FormikEnhancer(Form));
