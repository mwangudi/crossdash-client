import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent } from '@material-ui/core';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { appendSuffixToNumber } from '../../utils';
import ZoomTransition from '../Shared/ZoomTransition';
import TextField from '../Shared/TextField';

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

const ConvictionDetailsForm = props => {
  const { convictions, handleChange } = props;
  const [counter, setCounter] = React.useState(0);
  const [convictionDetails, setConvictionDetails] = React.useState('Testing');

  const increaseCounter = () => {
    setCounter(counter + 1);
  };

  const handleTextChange = textValue => {
    setConvictionDetails(textValue.toString());
  };

  const addConvictionsCount = () => {
    const countedConvictions = [...convictions];
    countedConvictions.push({
      id: counter,
      count: counter,
      details: convictionDetails,
    });
    increaseCounter();
    handleChange(countedConvictions);
  };

  return (
    <Wrapper className="w-100">
      <div>
        <div className="px-1">
          <TextField
            id="convictionDetails"
            label="Conviction details"
            variant="filled"
            type="text"
            rowsMax="4"
            rows={3}
            multiline
            fullWidth
            onChange={handleTextChange}
            value={convictionDetails}
            error={false}
            helperText=""
          />
        </div>
        <div className="px-1 mb-2">
          <Button
            disableElevation
            variant="contained"
            onClick={addConvictionsCount}
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
                      <p className="text-center card-title">
                        {appendSuffixToNumber(conviction.count + 1)} Convictions
                      </p>
                      <p className="card-content">
                        {conviction.convictionDetails}
                      </p>
                      <Button
                        variant="contained"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        color="secondary"
                        // onClick={() => removeAccidentCount(conviction.id)}
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
          {isEmpty(convictions) && (
            <p className="text-left w-100 text-label">No convictions</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

ConvictionDetailsForm.propTypes = {
  convictions: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ConvictionDetailsForm;
