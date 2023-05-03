import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent } from '@material-ui/core';
import styled from 'styled-components';
import { isEmpty, isEqual, isNil } from 'lodash';
import uuid from 'uuid-random';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ZoomTransition from '../Shared/ZoomTransition';
import TextField from '../Shared/TextField';
import DatePicker from '../Shared/DatePicker';
import utils from '../../utils';

const Wrapper = styled.div`
  .text-label {
    font-size: 14px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
  }

  .card-content {
    font-size: 14px;
    font-weight: 500;
  }

  .card-wrapper {
    height: 260px;
    overflow-y: auto;
    background-color: #e8e8e8;
  }

  .card-date {
    font-weight: 600;
  }

  .MuiCardContent-root {
    padding: 10px;
  }
`;

const dateString = dayjs().toString();
const dayBeforeCurrent = dayjs().subtract(1, 'd');

const ConvictionDetailsForm = props => {
  const { convictions, handleChange } = props;

  const formik = useFormik({
    initialValues: {
      convictionDate: dateString,
      convictionDetail: '',
    },
    validationSchema: Yup.object().shape({
      convictionDate: Yup.string()
        .required()
        .label('Conviction date'),
      convictionDetail: Yup.string()
        .required()
        .label('Conviction detail'),
    }),
    onSubmit: (values, bag) => {
      const countedConvictions = [...convictions];
      const randomId = uuid();
      countedConvictions.push({
        id: randomId,
        details: `${utils.formatDate(values.convictionDate, 'YYYY-MM-DD')} - ${
          values.convictionDetail
        }`,
      });
      handleChange(countedConvictions);
      bag.resetForm();
    },
  });

  const deleteConviction = deleteId => () => {
    const countedConvictions = [...convictions];
    const filteredArray = countedConvictions.filter(
      item => !isEqual(item.id, deleteId),
    );

    handleChange(filteredArray);
  };

  const handleDateChange = date => {
    formik.setFieldValue('convictionDate', !isNil(date) ? date.toString() : '');
  };

  return (
    <Wrapper className="w-100">
      <div>
        <div className="px-1 d-flex flex-row align-items-baseline">
          <div className="pr-2">
            <DatePicker
              id="convictionDate"
              value={formik.values.convictionDate}
              maxDate={dayBeforeCurrent}
              onChange={handleDateChange}
              label="Conviction Date"
              error={
                formik.touched.convictionDate && !formik.errors.convictionDate
              }
              helperText={formik.errors.convictionDate}
            />
          </div>
          <TextField
            id="convictionDetail"
            label="Conviction detail"
            variant="filled"
            type="text"
            rowsMax="4"
            onChange={formik.handleChange}
            value={formik.values.convictionDetail}
            error={
              formik.touched.convictionDetail && !formik.errors.convictionDetail
            }
            helperText={formik.errors.convictionDetail}
            rows={3}
            multiline
            fullWidth
          />
        </div>
        <div className="px-1 mb-2 d-flex flex-row align-items-center justify-content-end">
          <Button
            disableElevation
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Add
          </Button>
        </div>
      </div>
      <div>
        {!isEmpty(convictions) && (
          <div className="d-flex flex-column align-items-center card-wrapper py-2">
            {convictions.map(conviction => (
              <div className="mb-1 px-1 w-75" key={conviction.id}>
                <ZoomTransition animate>
                  <Card>
                    <CardContent>
                      <p className="card-content">{conviction.details}</p>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={deleteConviction(conviction.id)}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </ZoomTransition>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

ConvictionDetailsForm.propTypes = {
  convictions: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ConvictionDetailsForm;
