import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import actions from '../../store/rootActions';

const Logout = props => {
  const { logout } = props;
  const history = useHistory();

  React.useEffect(() => {
    const handleLogout = async () => {
      await logout();
      history.push(`/login`);
    };

    handleLogout();
  }, [logout, history]);
  return <div>Signing out ...</div>;
};

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, actions)(Logout);
