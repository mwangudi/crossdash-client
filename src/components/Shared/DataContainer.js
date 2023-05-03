import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import { isNil, isEmpty } from 'lodash';

const DataWrapper = styled.div`
  .text-mini-label {
    font-weight: 600;
    color: #424242;
    font-size: 0.9rem;
  }

  .text-content {
    font-size: 1.1rem;
    color: #424242;
    font-weight: 500;
  }
`;

const DataContainer = ({
  label,
  value,
  formatter,
  errorMessage,
  showDivider,
  className,
}) => {
  return (
    <DataWrapper className={className}>
      {!isNil(value) && !isEmpty(value) ? (
        <div className="d-flex flex-column align-items-start">
          <p className="mb-1 text-mini-label">{label}</p>
          <p className="mb-3 text-content">{formatter(value)}</p>
          {showDivider && <Divider className="w-100" variant="fullWidth" />}
        </div>
      ) : (
        <div className="d-flex flex-column align-items-start">
          <p className="mb-1 text-mini-label">{errorMessage}</p>
          <p className="mb-3 text-content">{label}</p>
          {showDivider && <Divider className="w-100" variant="fullWidth" />}
        </div>
      )}
    </DataWrapper>
  );
};

DataContainer.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  formatter: PropTypes.func,
  errorMessage: PropTypes.string,
  showDivider: PropTypes.bool,
  className: PropTypes.string,
};

DataContainer.defaultProps = {
  errorMessage: 'Missing information',
  showDivider: false,
  value: null,
  formatter: value => value,
  className: 'w-100',
};

export default DataContainer;
