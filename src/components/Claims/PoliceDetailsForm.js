import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';

import TextField from '../Shared/TextField';
import Switch from '../Shared/Switch';
import UploadField from '../Shared/UploadField';

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

  const handleFileChange = field => files => {
    setFieldValue(field, files);
  };

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Police Details</h6>
      <hr />
      <form id={id} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <TextField
              id="constablePoliceStation"
              label="Constable Police Station"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.constablePoliceStation}
              error={
                touched.constablePoliceStation &&
                !!errors.constablePoliceStation
              }
              helperText={errors.constablePoliceStation}
            />
            <TextField
              id="constableForceNumber"
              label="Constable force number"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.constableForceNumber}
              error={
                touched.constableForceNumber && !!errors.constableForceNumber
              }
              helperText={errors.constableForceNumber}
            />
            <Switch
              id="isProsecuting"
              label={
                driverForm.driverWasSelf
                  ? 'Are you prosecuting?'
                  : 'Is the driver prosecuting?'
              }
              switchLabelPrimary="Yes"
              onChange={handleChange}
              checked={values.isProsecuting}
              error={touched.isProsecuting && !!errors.isProsecuting}
              helperText={errors.isProsecuting}
            />
            {values.isProsecuting && (
              <UploadField
                label="Notice of prosecution"
                handleChange={handleFileChange('noticeOfProsecution')}
              />
            )}
            <TextField
              id="reportingPoliceStation"
              label="Reporting Police Station"
              variant="filled"
              type="text"
              fullWidth
              onChange={handleChange}
              value={values.reportingPoliceStation}
              error={
                touched.reportingPoliceStation &&
                !!errors.reportingPoliceStation
              }
              helperText={errors.reportingPoliceStation}
            />
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
  claim: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const FormikEnhancer = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    constablePoliceStation: Yup.string()
      .required()
      .label('Constable police station'),
    constableForceNumber: Yup.string()
      .required()
      .label('Constable force number'),
    isProsecuting: Yup.bool().label('Is prosecuting'),
    reportingPoliceStation: Yup.string()
      .required()
      .label('Reporting police station'),
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
  displayName: 'Police Details Form',
});

const PoliceForm = FormikEnhancer(Form);

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps)(PoliceForm);
