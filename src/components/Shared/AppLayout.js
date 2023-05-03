import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import styled from 'styled-components';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 220;

const Wrapper = styled.div`
  min-height: 100vh;

  .main-wrapper {
    overflow-y: auto;
  }

  button + button {
    margin-left: 1rem;
  }

  ${props => props.theme.breakpoints.up('md')} {
    .main-wrapper {
      padding-left: ${drawerWidth}px;
    }
  }
`;

const Layout = props => {
  const { children } = props;

  return (
    <Wrapper>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <main className="main-wrapper">{children}</main>
    </Wrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
