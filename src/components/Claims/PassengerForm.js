import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper, Button } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';

import uuid from 'uuid-random';
import TextField from '../Shared/TextField';
import RadioField from '../Shared/RadioField';
import Switch from '../Shared/Switch';

import actions from '../../store/rootActions';
import PassengerPreviewCard from './PassengerPreviewCard';

const Wrapper = styled(Paper)`
  .content-preview {
    max-height: 540px;
    overflow-y: auto;
  }
`;

const genderTypes = [
  {
    value: 'female',
    title: 'Female',
  },
  {
    value: 'male',
    title: 'Male',
  },
];

const Form = props => {
  const {
    id,
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    claim: { passengers },
  } = props;

  const handleGender = field => e => {
    const {
      target: { value },
    } = e;
    setFieldValue(field, value);
  };

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Passenger Details</h6>
      <hr />
      <form id={id} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <TextField
              id="firstName"
              label="First Name"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.firstName}
              error={!!errors.firstName || touched.firstName}
              helperText={errors.firstName}
              autoComplete="name"
              autoFocus
            />
            <TextField
              id="lastName"
              label="Last Name"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.lastName}
              error={!!errors.lastName || touched.lastName}
              helperText={errors.lastName}
              autoComplete="name"
            />
            <TextField
              id="surname"
              label="Surname"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.surname}
              error={touched.surname && !!errors.surname}
              helperText={errors.surname}
              autoComplete="name"
            />
            <RadioField
              id="gender"
              label="Gender"
              onChange={handleGender('gender')}
              value={values.gender}
              error={touched.gender && !!errors.gender}
              helperText={errors.gender}
              options={genderTypes}
            />
            <TextField
              id="phoneNumber"
              label="Phone Number"
              variant="filled"
              type="tel"
              fullWidth
              onChange={handleChange}
              value={values.phoneNumber}
              error={touched.phoneNumber && !!errors.phoneNumber}
              helperText={errors.phoneNumber}
              autoComplete="tel"
            />
            <Switch
              id="isAdult"
              label="Was the passenger an adult?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.isAdult}
              error={touched.isAdult && !!errors.isAdult}
              helperText={errors.isAdult}
            />

            <TextField
              id="address"
              label="What is their physical address"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.address}
              error={!!errors.address || touched.address}
              helperText={errors.address}
              autoComplete="street-address"
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
                passengers.map(p => <PassengerPreviewCard passenger={p} />),
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
  setFieldValue: PropTypes.func.isRequired,
};

const FormikEnhancer = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    firstName: Yup.string()
      .required()
      .label('First Name'),
    lastName: Yup.string()
      .required()
      .label('Last Name'),
    surname: Yup.string().label('Surname'),
    phoneNumber: Yup.string()
      .required()
      .label('Phone Number'),
    gender: Yup.string()
      .required()
      .label('Gender'),
    isAdult: Yup.bool().label('Passenger is an adult'),
    address: Yup.string().label('Passenger physical address'),
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
  displayName: 'Passenger Details',
});

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps, actions)(FormikEnhancer(Form));
