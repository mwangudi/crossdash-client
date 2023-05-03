import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import SelectField from '../Shared/SelectField';
import Switch from '../Shared/Switch';
import TextField from '../Shared/TextField';

const Form = props => {
  const {
    id,
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    actors,
  } = props;

  const handleSelectActor = field => e => {
    const {
      target: { value },
    } = e;

    setFieldValue(field, value);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-6 col-12">
          <SelectField
            id="assigneeId"
            variant="filled"
            label="Select assignee"
            type="text"
            options={actors}
            onChange={handleSelectActor('assigneeId')}
            value={values.assigneeId}
            error={touched.assigneeId && !!errors.assigneeId}
            helperText={errors.assigneeId}
            fullWidth
            displayEmpty
          />
          <TextField
            id="assignerNotes"
            label="Assigner Notes"
            variant="filled"
            type="text"
            rowsMax="4"
            rows={3}
            onChange={handleChange}
            value={values.assignerNotes}
            error={touched.assignerNotes && !!errors.assignerNotes}
            helperText={errors.assignerNotes}
            multiline
            fullWidth
          />
          <Switch
            id="priority"
            label="Priority"
            switchLabelPrimary="High"
            onChange={handleChange}
            checked={values.priority}
            error={touched.priority && !!errors.priority}
            helperText={errors.priority}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  actors: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const FormikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    priority: Yup.bool().label('Priority'),
    assignerNotes: Yup.string().label('Assigner Notes'),
    assigneeId: Yup.string()
      .required()
      .label('Assignee'),
  }),
  mapPropsToValues: () => ({
    assignerNotes: '',
    priority: false,
    assigneeId: '',
  }),
  handleSubmit: (payload, bag) => {
    const {
      props: { handleSubmit },
    } = bag;
    handleSubmit({
      ...payload,
    });
  },
  displayName: 'Assignment Form',
});

export default FormikEnhancer(Form);
