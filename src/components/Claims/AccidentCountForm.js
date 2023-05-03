import React from 'react';
import PropTypes from 'prop-types';
import { Button, Chip, Card, CardContent } from '@material-ui/core';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { isEmpty, isEqual } from 'lodash';
import uuid from 'uuid-random';
import { dateIsBefore, formatDate, appendSuffixToNumber } from '../../utils';
import DatePicker from '../Shared/DatePicker';
import ZoomTransition from '../Shared/ZoomTransition';

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

const CounterLabel = props => {
  const { count, label } = props;
  return (
    <div className="mb-2">
      <span className="text-label">{label}</span>
      <Chip className="px-3 py-1" label={count} />
    </div>
  );
};

CounterLabel.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

const AccidentForm = props => {
  const dateString = dayjs().toString();
  const { accidents, handleChange } = props;
  const [accidentDate, setAccidentDate] = React.useState(dateString);

  const handleDateChange = date => {
    const stringDate = date.toString();
    setAccidentDate(stringDate);
  };

  const addAccidentCount = () => {
    const countedAccidents = [...accidents];
    const randomId = uuid();
    if (
      dateIsBefore({
        dateToCheck: accidentDate,
        dateAgainst: dateString,
        unit: 'd',
      })
    ) {
      countedAccidents.push({
        id: randomId,
        date: accidentDate,
      });
    }
    handleChange(countedAccidents);
    setAccidentDate(dateString);
  };

  const deleteAccidentCount = deleteId => () => {
    const countedAccidents = [...accidents];
    const filteredArray = countedAccidents.filter(
      item => !isEqual(item.id, deleteId),
    );
    handleChange(filteredArray);
  };

  const dayBeforeCurrent = dayjs().subtract(1, 'd');
  return (
    <Wrapper className="w-100">
      <div className="d-flex flex-row justify-content-around align-items-end">
        <div className="px-1">
          <CounterLabel
            count={accidents.length}
            label="Accident count of the driver"
          />
        </div>
        <div className="px-1">
          <DatePicker
            id="accidentDate"
            value={accidentDate}
            maxDate={dayBeforeCurrent}
            onChange={handleDateChange}
            label="Accident Date"
            error={false}
            helperText=""
          />
        </div>
        <div className="px-1 mb-2">
          <Button
            disableElevation
            variant="contained"
            onClick={addAccidentCount}
          >
            Add
          </Button>
        </div>
      </div>
      <div>
        {!isEmpty(accidents) && (
          <div className="d-flex flex-column align-items-center card-wrapper py-2">
            {accidents.map((a, i) => (
              <div className="mb-1 px-1 w-75" key={a.id}>
                <ZoomTransition animate>
                  <Card>
                    <CardContent>
                      <p className="text-center card-title">
                        {appendSuffixToNumber(i + 1)} Accident
                      </p>
                      <p className="card-content">
                        Occurred on{' '}
                        <span className="card-date font-italic">
                          {formatDate(a.date)}
                        </span>
                      </p>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={deleteAccidentCount(a.id)}
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
        <div>
          {isEmpty(accidents) && (
            <p className="text-left w-100 text-label">0 accidents count</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

AccidentForm.propTypes = {
  accidents: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AccidentForm;
