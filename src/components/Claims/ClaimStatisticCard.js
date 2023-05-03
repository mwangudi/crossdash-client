import React from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';
import Icon from 'react-icons-kit';
import PropTypes from 'prop-types';

const Wrapper = styled(Paper)`
  height: 200px;

  ${({ bgcolor }) => bgcolor}

  .text-count {
    font-size: 2rem;
    font-weight: 600;
  }

  .icon-wrapper {
    color: #fff;
  }

  p {
    font-weight: 500;
    color: #fff;
  }
`;

const StatsCard = props => {
  const {
    cardItem: {
      cardIcon,
      cardTitle,
      cardTotal,
      rateOfChange,
      positive = true,
      bg,
    },
  } = props;
  return (
    <Wrapper className="w-100 px-3 py-4" bgcolor={bg}>
      <div className="d-flex flex-column align-items-left">
        <div className="icon-wrapper">
          <Icon icon={cardIcon} size={26} />
        </div>

        <p className="mb-0 pt-2 pb-1">{cardTitle}</p>
        <p className="mb-0 pt-1 pb-3 text-count">{cardTotal}</p>
        <p className="mb-0 pt-1">
          {positive ? 'Increased' : 'Decreased'} by {rateOfChange}
        </p>
      </div>
    </Wrapper>
  );
};

StatsCard.propTypes = {
  cardItem: PropTypes.object.isRequired,
};

export default StatsCard;
