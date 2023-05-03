import React from 'react';
import { Avatar } from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_account_circle as icAccount } from 'react-icons-kit/md/ic_account_circle';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  sm: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  md: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  lg: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  xl: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  default: {},
}));

const CustomAvatar = props => {
  const { imageSrc, altText, size } = props;
  const classes = useStyles();
  return (
    <div className="p-1">
      {isNil(imageSrc) && (
        <Avatar className={classes[size]}>
          <Icon size="100%" icon={icAccount} />
        </Avatar>
      )}
      {!isNil(imageSrc) && (
        <Avatar alt={altText} src={imageSrc} className={classes[size]} />
      )}
    </div>
  );
};

CustomAvatar.propTypes = {
  imageSrc: PropTypes.string,
  altText: PropTypes.string,
  size: PropTypes.string,
};

CustomAvatar.defaultProps = {
  imageSrc: null,
  altText: 'User profile',
  size: 'default',
};

export default CustomAvatar;
