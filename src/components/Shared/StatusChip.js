import React from 'react';
import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SChip = styled(Chip)`
  background-color: ${props => {
    const { label } = props;
    let color = '';
    switch (label) {
      case 'new':
        color = '#ef6c00';
        break;
      case 'in approval':
      case 'in review':
      case 'in processing':
      case 'in assessment':
      case 'not paid':
      case 'approved, processing payment':
        color = '#2196f3';
        break;
      case 'ready for finance':
      case 'approved':
      case 'ready for assessment':
      case 'ready for approval':
      case 'paid':
        color = '#43a047';
        break;
      case 'rejected':
      case 'back to customer':
        color = '#ab47bc';
        break;
      default:
        break;
    }
    return color;
  }};
  color: #fff;
`;

const StatusChip = props => {
  const { status } = props;
  return <SChip className="text-capitalize" label={status} />;
};

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusChip;
