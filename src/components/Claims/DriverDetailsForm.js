import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { isNil } from 'lodash';
import { connect } from 'react-redux';

import TextField from '../Shared/TextField';
import DatePicker from '../Shared/DatePicker';
import Switch from '../Shared/Switch';
import UploadField from '../Shared/UploadField';
import AccidentCountForm from './AccidentCountForm';
import ConvictionsForm from './ConvictionsDetailsForm';
import ZoomTransition from '../Shared/ZoomTransition';
import { legalAgeLimit, validPhoneNumber } from '../../utils';

const Wrapper = styled(Paper)``;

const Form = props => {
  const {
    id,
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    claim: { driverForm },
  } = props;

  const handleDateChange = field => date => {
    let dateString = '';
    if (!isNil(date)) {
      dateString = date.toString();
    }
    setFieldValue(field, dateString);
  };

  const handleAccidentCountChange = field => accidentDates => {
    setFieldValue(field, accidentDates);
  };

  const handleConvictionsCountChange = field => convictionDetails => {
    setFieldValue(field, convictionDetails);
  };

  const handleFileChange = field => files => {
    setFieldValue(field, files);
  };

  return (
    <Wrapper className="p-3 w-100 mb-3" elevation={3}>
      <h6 className="formTitle">Driver Details</h6>
      <hr />
      <form id={id} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <Switch
              id="driverWasSelf"
              label="Were you the driver?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.driverWasSelf}
              error={touched.driverWasSelf && !!errors.driverWasSelf}
              helperText={errors.driverWasSelf}
            />
            {!values.driverWasSelf && (
              <>
                {' '}
                <ZoomTransition animate={!values.driverWasSelf}>
                  <Switch
                    id="isEmployee"
                    label="Is the driver employed?"
                    switchLabelPrimary="Yes"
                    onChange={handleChange}
                    checked={values.isEmployee}
                    error={touched.isEmployee && !!errors.isEmployee}
                    helperText={errors.isEmployee}
                  />
                </ZoomTransition>
                {values.isEmployee && (
                  <ZoomTransition animate={values.isEmployee}>
                    {' '}
                    <TextField
                      id="yearsInYourService"
                      type="number"
                      label="Years in the service"
                      variant="filled"
                      fullWidth
                      onChange={handleChange}
                      value={values.yearsInYourService}
                      error={
                        touched.yearsInYourService &&
                        !!errors.yearsInYourService
                      }
                      helperText={errors.yearsInYourService}
                    />
                  </ZoomTransition>
                )}
                <ZoomTransition animate={!values.driverWasSelf}>
                  <Switch
                    id="wasDrivingWithPermission"
                    label="Was the driver driving with permission?"
                    switchLabelPrimary="Yes"
                    onChange={handleChange}
                    checked={values.wasDrivingWithPermission}
                    error={
                      touched.wasDrivingWithPermission &&
                      !!errors.wasDrivingWithPermission
                    }
                    helperText={errors.wasDrivingWithPermission}
                  />
                </ZoomTransition>
              </>
            )}
            {!values.driverWasSelf && (
              <>
                <TextField
                  id="firstName"
                  label="First name"
                  variant="filled"
                  type="text"
                  fullWidth
                  onChange={handleChange}
                  value={values.firstName}
                  error={!!errors.firstName && touched.firstName}
                  helperText={errors.firstName}
                  autoComplete="name"
                />
                <TextField
                  id="lastName"
                  label="Last name"
                  variant="filled"
                  type="text"
                  fullWidth
                  onChange={handleChange}
                  value={values.lastName}
                  error={!!errors.lastName && touched.lastName}
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
                  error={!!errors.surname && touched.surname}
                  helperText={errors.surname}
                  autoComplete="name"
                />
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <div className="pr-4">
                    <DatePicker
                      id="driverDateOfBirth"
                      value={values.driverDateOfBirth}
                      onChange={handleDateChange('driverDateOfBirth')}
                      label="Date of birth"
                      error={
                        !!errors.driverDateOfBirth && touched.driverDateOfBirth
                      }
                      helperText={errors.driverDateOfBirth}
                      autoComplete="bday"
                    />
                  </div>
                  <div className="pl-4">
                    <TextField
                      id="driverPhoneNumber"
                      label="Phone number"
                      variant="filled"
                      type="text"
                      fullWidth
                      onChange={handleChange}
                      value={values.driverPhoneNumber}
                      error={
                        !!errors.driverPhoneNumber && touched.driverPhoneNumber
                      }
                      helperText={errors.driverPhoneNumber}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}
            <Switch
              id="isLicensed"
              label={
                values.driverWasSelf
                  ? 'Are you licensed?'
                  : 'Is the driver licensed?'
              }
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.isLicensed}
              error={touched.isLicensed && !!errors.isLicensed}
              helperText={errors.isLicensed}
            />
            {values.isLicensed && (
              <ZoomTransition animate={values.isLicensed}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <div className="pr-4">
                    <DatePicker
                      id="dateLicensed"
                      value={values.dateLicensed}
                      onChange={handleDateChange('dateLicensed')}
                      label="Date licensed"
                    />
                  </div>
                  <div className="pl-4">
                    <TextField
                      id="drivingLicenseNumber"
                      label="Driving license no"
                      variant="filled"
                      type="text"
                      fullWidth
                      onChange={handleChange}
                      value={values.drivingLicenseNumber}
                      error={
                        !!errors.drivingLicenseNumber &&
                        touched.drivingLicenseNumber
                      }
                      helperText={errors.drivingLicenseNumber}
                    />
                  </div>
                </div>
              </ZoomTransition>
            )}
            <TextField
              id="yearsOfDrivingExperience"
              type="number"
              label="Years of driving experience"
              variant="filled"
              fullWidth
              onChange={handleChange}
              value={values.yearsOfDrivingExperience}
              error={
                touched.yearsOfDrivingExperience &&
                !!errors.yearsOfDrivingExperience
              }
              helperText={errors.yearsOfDrivingExperience}
            />
            {values.driverWasSelf && (
              <div className="row justify-content-between mx-0">
                <div className="col-lg-12 px-0">
                  <UploadField
                    label="Your statement"
                    handleChange={handleFileChange('driverStatement')}
                    filesLimit={1}
                    initialFiles={[
                      ...driverForm.driverStatement
                        .map(p => p.name || '')
                        .filter(p => p !== ''),
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 col-12">
            {!values.driverWasSelf && !values.isEmployee && (
              <Switch
                id="hasVehicle"
                label="Does the driver own a vehicle?"
                switchLabelPrimary="Yes"
                onChange={handleChange}
                checked={values.hasVehicle}
                error={touched.hasVehicle && !!errors.hasVehicle}
                helperText={errors.hasVehicle}
              />
            )}
            {values.hasVehicle && !values.driverWasSelf && !values.isEmployee && (
              <ZoomTransition animate={values.hasVehicle}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <div className="pr-4">
                    <TextField
                      id="insurerName"
                      label="Insurance Name"
                      variant="filled"
                      type="text"
                      fullWidth
                      onChange={handleChange}
                      value={values.insurerName}
                      error={!!errors.insurerName && touched.insurerName}
                      helperText={errors.insurerName}
                    />
                  </div>
                  <div className="pl-4">
                    <TextField
                      id="insurerPolicyNumber"
                      label="Insurance Policy Number"
                      variant="filled"
                      type="text"
                      fullWidth
                      onChange={handleChange}
                      value={values.insurerPolicyNumber}
                      error={
                        !!errors.insurerPolicyNumber &&
                        touched.insurerPolicyNumber
                      }
                      helperText={errors.insurerPolicyNumber}
                    />
                  </div>
                </div>
              </ZoomTransition>
            )}
            {!values.driverWasSelf && (
              <div className="row justify-content-between mx-0">
                <div className="col-lg-12 px-0">
                  <UploadField
                    label="Driver's statement"
                    handleChange={handleFileChange('driverStatement')}
                    filesLimit={1}
                    initialFiles={[
                      ...driverForm.driverStatement
                        .map(p => p.name || '')
                        .filter(p => p !== ''),
                    ]}
                  />
                </div>
              </div>
            )}
            <Switch
              id="isDriverToBlame"
              label={
                values.driverWasSelf
                  ? 'Are you to blame for the accident?'
                  : 'Is the driver to blame for the accident?'
              }
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.isDriverToBlame}
              error={touched.isDriverToBlame && !!errors.isDriverToBlame}
              helperText={errors.isDriverToBlame}
            />
            <div className="d-flex flex-row align-items-center justify-content-between py-2">
              <div className="pr-4">
                <Switch
                  id="hasAdmittedLiability"
                  label={
                    values.driverWasSelf
                      ? 'Have you admitted liability?'
                      : 'Has the driver admitted liability?'
                  }
                  switchLabelPrimary="Yes"
                  onChange={handleChange}
                  checked={values.hasAdmittedLiability}
                  error={
                    touched.hasAdmittedLiability &&
                    !!errors.hasAdmittedLiability
                  }
                  helperText={errors.hasAdmittedLiability}
                />
              </div>
              <div className="pl-4">
                <Switch
                  id="hasBeenConvicted"
                  label={
                    values.driverWasSelf
                      ? 'Have you ever been convicted before?'
                      : 'The driver has been convicted before?'
                  }
                  switchLabelPrimary="Yes"
                  onChange={handleChange}
                  checked={values.hasBeenConvicted}
                  error={touched.hasBeenConvicted && !!errors.hasBeenConvicted}
                  helperText={errors.hasBeenConvicted}
                />
              </div>
            </div>
            {values.hasBeenConvicted && (
              <ZoomTransition animate={values.hasBeenConvicted}>
                <ConvictionsForm
                  convictions={values.convictionDetails}
                  handleChange={handleConvictionsCountChange(
                    'convictionDetails',
                  )}
                />
              </ZoomTransition>
            )}
            <AccidentCountForm
              accidents={values.accidentDates}
              handleChange={handleAccidentCountChange('accidentDates')}
            />
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

Form.propTypes = {
  claim: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

// eslint-disable-next-line
Yup.addMethod(Yup.string, 'legalAge', function() {
  return this.test({
    name: 'age',
    exclusive: true,
    message: 'You must be of legal age, 18+',
    test: legalAgeLimit,
  });
});

// eslint-disable-next-line
Yup.addMethod(Yup.string, 'phoneNumber', function() {
  return this.test({
    name: 'phone',
    exclusive: true,
    message: 'Must be a valid phone number',
    test: validPhoneNumber,
  });
});

const FormikEnhancer = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    driverWasSelf: Yup.bool().label('Driver Self'),
    isEmployee: Yup.bool().label('Driver is employed'),
    yearsInYourService: Yup.number()
      .when('isEmployee', {
        is: true,
        then: Yup.number()
          .min(1, `New to the job? Count this as year 1`)
          .max(50, `You're supposed to be retired`)
          .required(),
        otherwise: Yup.number(),
      })
      .label('Years in your service'),
    wasDrivingWithPermission: Yup.bool().label('Driver with permission'),
    firstName: Yup.string()
      .when('driverWasSelf', {
        is: false,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('First name'),
    lastName: Yup.string()
      .when('driverWasSelf', {
        is: false,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Last name'),
    surname: Yup.string().label('surname'),
    driverDateOfBirth: Yup.string()
      .when('driverWasSelf', {
        is: true,
        then: Yup.string(),
        otherwise: Yup.string(),
      })
      .when('isEmployee', {
        is: true,
        then: Yup.string().legalAge(),
        otherwise: Yup.string(),
      })
      .required()
      .label('Date of birth'),
    driverPhoneNumber: Yup.string()
      .phoneNumber()
      .when('driverWasSelf', {
        is: true,
        then: Yup.string(),
        otherwise: Yup.string().required(),
      })
      .label('Phone number'),
    isLicensed: Yup.bool().label('Driver Licensed'),
    drivingLicenseNumber: Yup.string()
      .when('isLicensed', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('License number'),
    dateLicensed: Yup.string()
      .when('isLicensed', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Date licensed'),
    yearsOfDrivingExperience: Yup.number()
      .min(1, `Just started? Count this as year 1`)
      .max(90, `You're supposed to be retired`)
      .label('Years of experience'),
    hasAdmittedLiability: Yup.bool().label('Has admitted liability'),
    hasBeenConvicted: Yup.bool().label('Has been convicted'),
    convictionDetails: Yup.array().label('Conviction details'),
    accidentDates: Yup.array().label('Accident count'),
    hasVehicle: Yup.bool().label('Vehicle is insured'),
    insurerName: Yup.string()
      .when('hasVehicle', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Insurance Name'),
    insurerPolicyNumber: Yup.string()
      .when('hasVehicle', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Insurance Policy Number'),
  }),
  mapPropsToValues: ({ form }) => ({
    ...form,
  }),
  handleSubmit: (payload, bag) => {
    const {
      props: { handleSubmit },
    } = bag;
    handleSubmit({
      ...payload,
    });
  },
  displayName: 'Driver Details Form',
});

const DriverForm = FormikEnhancer(Form);

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps)(DriverForm);
