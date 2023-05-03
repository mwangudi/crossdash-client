import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper, Button } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isNil, find } from 'lodash';

import uuid from 'uuid-random';
import TextField from '../Shared/TextField';
import RadioField from '../Shared/RadioField';
import SelectField from '../Shared/SelectField';
import Switch from '../Shared/Switch';
import InjuredPersonPreviewCard from './InjuredPersonPreviewCard';
import actions from '../../store/rootActions';
import ZoomTransition from '../Shared/ZoomTransition';

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

const relationTypes = [
  {
    value: '',
    title: 'Select Relation',
  },
  {
    value: 'parent',
    title: 'Parent',
  },
  {
    value: 'sibling',
    title: 'Sibling',
  },
  {
    value: 'spouse',
    title: 'Spouse',
  },
  {
    value: 'child',
    title: 'Child',
  },
  {
    value: 'friend',
    title: 'Friend',
  },
  {
    value: 'none',
    title: 'None',
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
    fetchIdentityTypes,
    claim: { injuredPeople, driverForm },
    shared: { identificationTypes },
  } = props;

  const handleGender = field => e => {
    const {
      target: { value },
    } = e;
    setFieldValue(field, value);
  };

  const handleSelectID = field => e => {
    const {
      target: { value },
    } = e;
    setFieldValue(field, value);
  };

  const handleSelectIdType = field => e => {
    const {
      target: { value },
    } = e;
    setFieldValue(field, value);
  };

  const getIdentityType = identityTypeId => {
    if (isNil(identityTypeId)) {
      return '';
    }
    return find(identificationTypes, {
      id: identityTypeId,
    });
  };

  React.useEffect(() => {
    const fetchIdentityTypesAsync = async () => {
      await fetchIdentityTypes({
        scope: '/identification_types',
      });
    };

    fetchIdentityTypesAsync();
  }, [fetchIdentityTypes]);

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Injured Persons Details</h6>
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
            <SelectField
              id="relationToClaimant"
              variant="filled"
              label={
                driverForm.driverWasSelf
                  ? `How are you related to ${`${values.firstName} ${values.lastName}`}`
                  : 'Relationship to claimant'
              }
              type="text"
              fullWidth
              displayEmpty
              options={relationTypes}
              onChange={handleSelectID('relationToClaimant')}
              value={values.relationToClaimant}
              error={touched.relationToClaimant || !!errors.relationToClaimant}
              helperText={errors.relationToClaimant}
            />
            <Switch
              id="isAdult"
              label="Was the victim an adult?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.isAdult}
              error={touched.isAdult && !!errors.isAdult}
              helperText={errors.isAdult}
            />
            {values.isAdult && (
              <ZoomTransition animate={values.isAdult}>
                <div className="d-flex flex-row align-items-baseline">
                  <div className="pr-1 w-50">
                    <SelectField
                      id="identificationTypeId"
                      label="Identity type"
                      variant="filled"
                      type="text"
                      options={[
                        ...identificationTypes.map(identityType => {
                          return {
                            value: identityType.id,
                            title: identityType.attributes.name,
                          };
                        }),
                      ]}
                      onChange={handleSelectIdType('identificationTypeId')}
                      value={values.identificationTypeId}
                      error={
                        touched.identificationTypeId &&
                        !!errors.identificationTypeId
                      }
                      helperText={errors.identificationTypeId}
                      fullWidth
                      displayEmpty
                    />
                  </div>
                  <div className="pl-1 w-50">
                    <TextField
                      id="identificationNumber"
                      label={
                        injuredPeople.identificationTypeId
                          ? `${values.identificationTypeId}`
                          : 'Identity Number'
                      }
                      variant="filled"
                      type="text"
                      fullWidth
                      onChange={handleChange}
                      value={values.identificationNumber}
                      error={
                        touched.identificationNumber &&
                        !!errors.identificationNumber
                      }
                      helperText={errors.identificationNumber}
                    />
                  </div>
                </div>
              </ZoomTransition>
            )}
            <Switch
              id="wasInAVehicle"
              label="Was the victim in the vehicle?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.wasInAVehicle}
              error={touched.wasInAVehicle && !!errors.wasInAVehicle}
              helperText={errors.wasInAVehicle}
            />
            {values.wasInAVehicle && (
              <>
                <ZoomTransition animate={values.wasInAVehicle}>
                  <Switch
                    id="wasDriver"
                    label="Was the victim a driver"
                    switchLabelPrimary="Yes"
                    onChange={handleChange}
                    checked={values.wasDriver}
                    error={touched.wasDriver && !!errors.wasDriver}
                    helperText={errors.wasDriver}
                  />
                  <TextField
                    id="vehicleRegistrationNumber"
                    label="Vehicle registation number"
                    variant="filled"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={values.vehicleRegistrationNumber}
                    error={
                      !!errors.vehicleRegistrationNumber ||
                      touched.vehicleRegistrationNumber
                    }
                    helperText={errors.vehicleRegistrationNumber}
                  />
                </ZoomTransition>
              </>
            )}
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
                injuredPeople.map(injured => (
                  <InjuredPersonPreviewCard
                    injured={{
                      ...injured,
                      identityType: getIdentityType(
                        injured.identificationTypeId,
                      ),
                    }}
                  />
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
  shared: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  fetchIdentityTypes: PropTypes.func.isRequired,
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
    gender: Yup.string()
      .required()
      .label('Gender'),
    isAdult: Yup.bool().label('Injured person is an adult'),
    identificationTypeId: Yup.string()
      .when('isAdult', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Identity Type'),
    identificationNumber: Yup.string()
      .when('isAdult', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Identity Number'),
    relationToClaimant: Yup.string()
      .required()
      .label('Relationship to the claimant'),
    wasInAVehicle: Yup.bool().label('Victim was in vehicle'),
    wasDriver: Yup.bool().label('Victim was driver'),
    vehicleRegistrationNumber: Yup.string()
      .when('wasInAVehicle', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Vehicle registration number'),
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
  displayName: 'Injured Person Details',
});

function mapStateToProps(state) {
  return {
    claim: state.claim,
    shared: state.shared,
  };
}

export default connect(mapStateToProps, actions)(FormikEnhancer(Form));
