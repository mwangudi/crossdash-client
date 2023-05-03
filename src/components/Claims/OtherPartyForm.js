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
import actions from '../../store/rootActions';
import OtherPartyPreview from './OtherPartyPreviewCard';
import SelectField from '../Shared/SelectField';

const Wrapper = styled(Paper)`
  .content-preview {
    max-height: 680px;
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
    setFieldValue,
    fetchIdentityTypes,
    claim: { otherParties },
    shared: { identificationTypes },
  } = props;

  React.useEffect(() => {
    const fetchIdentityTypesAsync = async () => {
      await fetchIdentityTypes({
        scope: '/identification_types',
      });
    };

    fetchIdentityTypesAsync();
  }, [fetchIdentityTypes]);

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

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Other Party Details</h6>
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
                    !!errors.identificationTypeId &&
                    touched.identificationTypeId
                  }
                  helperText={errors.identificationTypeId}
                  fullWidth
                  displayEmpty
                />
              </div>
              <div className="pl-1 w-50">
                <TextField
                  id="identificationNumber"
                  label="Identity number"
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
            <TextField
              id="insurer"
              label="Insured by"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.insurer}
              error={touched.insurer && !!errors.insurer}
              helperText={errors.insurer}
            />
            {values.insurer && (
              <TextField
                id="insurerPolicyNumber"
                label="Policy Number"
                variant="filled"
                type="text"
                fullWidth
                onChange={handleChange}
                value={values.insurerPolicyNumber}
                error={
                  touched.insurerPolicyNumber && !!errors.insurerPolicyNumber
                }
                helperText={errors.insurerPolicyNumber}
              />
            )}
            <TextField
              id="vehicleDamages"
              label="Vehicle damages"
              variant="filled"
              type="text"
              multiline
              rowsMax="4"
              rows={3}
              fullWidth
              onChange={handleChange}
              value={values.vehicleDamages}
              error={!!errors.vehicleDamages && touched.vehicleDamages}
              helperText={errors.vehicleDamages}
            />
            <TextField
              id="vehicleRegistrationNumber"
              label="Vehicle registration No."
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
                otherParties.map(otherParty => (
                  <OtherPartyPreview
                    otherParty={{
                      ...otherParty,
                      identityType: getIdentityType(
                        otherParty.identificationTypeId,
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
  fetchIdentityTypes: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
  shared: PropTypes.object.isRequired,
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
    identificationTypeId: Yup.string()
      .required()
      .label('Identification type'),
    identificationNumber: Yup.string()
      .required()
      .label('Identity Number'),
    insurer: Yup.string()
      .required()
      .label('Insurance company'),
    insurerPolicyNumber: Yup.string()
      .required()
      .label('Policy Number'),
    vehicleDamages: Yup.string()
      .required()
      .label('Vehicle Damages'),
    vehicleRegistrationNumber: Yup.string()
      .required()
      .label('Vehicle Registration Number'),
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
  displayName: 'Other Party Details',
});

function mapStateToProps(state) {
  return {
    claim: state.claim,
    shared: state.shared,
  };
}

export default connect(mapStateToProps, actions)(FormikEnhancer(Form));
