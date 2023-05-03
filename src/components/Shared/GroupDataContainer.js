import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import { isNil, isEmpty } from 'lodash';

const DataWrapper = styled.div`
  .text-title-label {
    font-weight: 600;
    color: #424242;
    font-size: 1.2rem;
  }

  .text-content {
    font-size: 1rem;
    color: #1b1b1e;
    font-weight: 400;
  }
`;

const GroupDataContainer = ({
  label,
  value,
  errorMessage,
  showDivider,
  className,
}) => {
  return (
    <DataWrapper className={className}>
      {!isNil(value) && !isEmpty(value) ? (
        <div className="d-flex flex-column align-items-start">
          <p className="mb-3 text-title-label">{label}</p>
          {value.map((v, i) => (
            <p className="mb-1 text-content" key={i}>
              {v || ''}
            </p>
          ))}
          {showDivider && <Divider className="w-100" variant="fullWidth" />}
        </div>
      ) : (
        <div className="d-flex flex-column align-items-start">
          <p className="mb-1 text-title-label">{errorMessage}</p>
          <p className="mb-3 text-content">{label}</p>
          {showDivider && <Divider className="w-100" variant="fullWidth" />}
        </div>
      )}
    </DataWrapper>
  );
};

GroupDataContainer.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  errorMessage: PropTypes.string,
  showDivider: PropTypes.bool,
  className: PropTypes.string,
};

GroupDataContainer.defaultProps = {
  errorMessage: 'Missing information',
  showDivider: false,
  value: null,
  className: 'w-100',
};

export default GroupDataContainer;
