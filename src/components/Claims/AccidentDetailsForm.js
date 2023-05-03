import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';

import TextField from '../Shared/TextField';
import DatePicker from '../Shared/DatePicker';
import Switch from '../Shared/Switch';
import UploadField from '../Shared/UploadField';

import ZoomTransition from '../Shared/ZoomTransition';

const Wrapper = styled(Paper)`
  .s-upload-field {
    .MuiGrid-spacing-xs-8 {
      width: auto;
      margin: 0px;
    }
    .MuiGrid-item {
      padding: 3px;
    }
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
    claim: { driverForm, accidentForm },
  } = props;

  const handleDateChange = field => date => {
    const dateString = date.toString();
    setFieldValue(field, dateString);
  };

  const handleFileChange = field => files => {
    setFieldValue(field, files);
  };

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Accident Details</h6>
      <hr />
      <form id={id} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <TextField
              id="placeOfAccident"
              label="Place of accident"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.placeOfAccident}
              error={!!errors.placeOfAccident && touched.placeOfAccident}
              helperText={errors.placeOfAccident}
              autoComplete="street-address"
              autoFocus
            />
            <DatePicker
              id="dateOfAccident"
              type="text"
              value={values.dateOfAccident}
              onChange={handleDateChange('dateOfAccident')}
              label="Date of accident"
            />
            <Switch
              id="roadWet"
              label="Was the road wet during the accident?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.roadWet}
              error={touched.roadWet && !!errors.roadWet}
              helperText={errors.roadWet}
            />
            <TextField
              id="typeOfRoad"
              label="Type of road the accident occurred on, tarmac, murram e.t.c"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.typeOfRoad}
              error={!!errors.typeOfRoad && touched.typeOfRoad}
              helperText={errors.typeOfRoad}
            />
            <Switch
              id="visibilityDuringAccident"
              label="Was the road clear during the accident?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.visibilityDuringAccident}
              error={
                touched.visibilityDuringAccident &&
                !!errors.visibilityDuringAccident
              }
              helperText={errors.visibilityDuringAccident}
            />
            <TextField
              id="weatherConditions"
              label="What was the weather condition during the accident?"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.weatherConditions}
              error={touched.weatherConditions && !!errors.weatherConditions}
              helperText={errors.weatherConditions}
            />
            <TextField
              id="vehicleUseDuringAccident"
              label="What was the vehicle being used for during the accident?"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.vehicleUseDuringAccident}
              error={
                touched.vehicleUseDuringAccident &&
                !!errors.vehicleUseDuringAccident
              }
              helperText={errors.vehicleUseDuringAccident}
            />
            <Switch
              id="warnedOtherParty"
              label={
                driverForm.driverWasSelf
                  ? 'Did you warn other parties just before the accident?'
                  : 'Did the driver warn other parties just before the accident?'
              }
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.warnedOtherParty}
              error={touched.warnedOtherParty && !!errors.warnedOtherParty}
              helperText={errors.warnedOtherParty}
            />
          </div>
          <div className="col-lg-6 col-12">
            <Switch
              id="wasTheLightsOn"
              label="Were lights inside the vehicle on?"
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.wasTheLightsOn}
              error={touched.wasTheLightsOn && !!errors.wasTheLightsOn}
              helperText={errors.wasTheLightsOn}
            />
            <TextField
              id="estimatedSpeed"
              type="number"
              label="Estimated speed during the accident (Km/h)"
              variant="filled"
              fullWidth
              onChange={handleChange}
              value={values.estimatedSpeed}
              error={touched.estimatedSpeed && !!errors.estimatedSpeed}
              helperText={errors.estimatedSpeed}
            />
            <Switch
              id="hadTrailerAttached"
              label={
                driverForm.driverWasSelf
                  ? 'Did you have a trailer attached?'
                  : 'Did the driver have a trailer attached?'
              }
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.hadTrailerAttached}
              error={touched.hadTrailerAttached && !!errors.hadTrailerAttached}
              helperText={errors.hadTrailerAttached}
            />
            {values.hadTrailerAttached && (
              <>
                <ZoomTransition animate={values.hadTrailerAttached}>
                  <TextField
                    id="trailerWeight"
                    type="number"
                    label="Trailer weight (Kgs)"
                    variant="filled"
                    fullWidth
                    onChange={handleChange}
                    value={values.trailerWeight}
                    error={touched.trailerWeight && !!errors.trailerWeight}
                    helperText={errors.trailerWeight}
                  />
                  <Switch
                    id="hadGoodsDuringAccident"
                    label="Did the trailer carry any goods?"
                    switchLabelPrimary="Yes"
                    onChange={handleChange}
                    checked={values.hadGoodsDuringAccident}
                    error={
                      touched.hadGoodsDuringAccident &&
                      !!errors.hadGoodsDuringAccident
                    }
                    helperText={errors.hadGoodsDuringAccident}
                  />
                  {values.hadGoodsDuringAccident && (
                    <>
                      <ZoomTransition animate={values.hadGoodsDuringAccident}>
                        <TextField
                          id="vehicleWeightDuringAccident"
                          type="number"
                          label="Total weight during the accident (Kgs)?"
                          variant="filled"
                          fullWidth
                          onChange={handleChange}
                          value={values.vehicleWeightDuringAccident}
                          error={
                            touched.vehicleWeightDuringAccident &&
                            !!errors.vehicleWeightDuringAccident
                          }
                          helperText={errors.vehicleWeightDuringAccident}
                        />
                        <TextField
                          id="goodsCarriedDetails"
                          label="Goods in the vehicle during the accident"
                          variant="filled"
                          type="text"
                          fullWidth
                          onChange={handleChange}
                          value={values.goodsCarriedDetails}
                          error={
                            touched.goodsCarriedDetails &&
                            !!errors.goodsCarriedDetails
                          }
                          helperText={errors.goodsCarriedDetails}
                        />
                      </ZoomTransition>
                    </>
                  )}
                </ZoomTransition>
              </>
            )}

            <div className="row justify-content-between mx-0 pt-3">
              <div className="col-lg-6 pl-0 s-upload-field">
                <UploadField
                  label="Accident photo"
                  filesLimit={5}
                  handleChange={handleFileChange('accidentPhotos')}
                  initialFiles={[
                    ...accidentForm.accidentPhotos
                      .map(p => p.name || '')
                      .filter(p => p !== ''),
                  ]}
                />
              </div>
              <div className="col-lg-6 pl-0 s-upload-field">
                <UploadField
                  label="Accident sketch"
                  filesLimit={1}
                  handleChange={handleFileChange('accidentSketch')}
                  initialFiles={[
                    ...accidentForm.accidentSketch
                      .map(p => p.name || '')
                      .filter(p => p !== ''),
                  ]}
                />
              </div>
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
  setFieldValue: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};

const FormikEnhancer = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    placeOfAccident: Yup.string()
      .required()
      .label('Place of accident'),
    dateOfAccident: Yup.string()
      .required()
      .label('Date of accident'),
    roadWet: Yup.bool().label('Road wet'),
    typeOfRoad: Yup.string()
      .required()
      .label('Type of road'),
    visibilityDuringAccident: Yup.bool().label('Road clear'),
    weatherConditions: Yup.string()
      .required()
      .label('Weather condition'),
    vehicleUseDuringAccident: Yup.string()
      .required()
      .label('What was the vehicle use'),
    warnedOtherParty: Yup.bool().label('Warn other parties'),
    wasTheLightsOn: Yup.bool().label('Lights on'),
    hadTrailerAttached: Yup.bool().label('Trailer attached'),
    trailerWeight: Yup.number()
      .when('hadTrailerAttached', {
        is: true,
        then: Yup.number()
          .min(40, `Minimum weight is 40Kgs`)
          .required(),
        otherwise: Yup.number(),
      })
      .label('Trailer weight'),
    hadGoodsDuringAccident: Yup.bool().label('Trailer had goods'),
    vehicleWeightDuringAccident: Yup.number()
      .when('hadGoodsDuringAccident', {
        is: true,
        then: Yup.number()
          .min(40, `Minimum weight is 40Kgs`)
          .required(),
        otherwise: Yup.number(),
      })
      .label('Weight carried'),
    goodsCarriedDetails: Yup.string()
      .when('hadGoodsDuringAccident', {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      })
      .label('Goods carried'),
    estimatedSpeed: Yup.number()
      .min(0, `No negative speed, at speed 0 means the car was not moving`)
      .required()
      .label('Estimated speed'),
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
  displayName: 'Accident Details Form',
});

const AccidentForm = FormikEnhancer(Form);

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps)(AccidentForm);
