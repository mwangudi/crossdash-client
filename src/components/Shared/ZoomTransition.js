import React from 'react';
import { Zoom, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

const ZoomTransition = props => {
  const { children, animate, period } = props;
  return (
    <Zoom
      in={animate}
      style={{ transformOrigin: '0 0 0' }}
      {...(animate ? { timeout: period } : {})}
    >
      <Paper elevation={0}>{children}</Paper>
    </Zoom>
  );
};

ZoomTransition.propTypes = {
  children: PropTypes.node.isRequired,
  animate: PropTypes.bool.isRequired,
  period: PropTypes.number,
};

ZoomTransition.defaultProps = {
  period: 300,
};

export default ZoomTransition;
