import React from 'react';
import { Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import LoginForm from './LoginForm';
import actions from '../../store/rootActions';

const Wrapper = styled.div`
  height: 100vh;
`;

const LoginPage = props => {
  const {
    auth: { loginForm },
    signin,
  } = props;

  return (
    <Wrapper className="container">
      <div className="row h-100 align-items-center justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-10">
          <Paper elevation={3} variant="elevation">
            <LoginForm form={loginForm} handleSubmit={signin} />
          </Paper>
        </div>
      </div>
    </Wrapper>
  );
};

LoginPage.propTypes = {
  auth: PropTypes.object.isRequired,
  signin: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(LoginPage);
