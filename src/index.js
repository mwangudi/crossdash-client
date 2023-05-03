import 'core-js/es6/map';
import 'core-js/es6/set';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/custom.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'raf/polyfill';
import { Router } from 'react-router';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'notistack';
import { Button } from '@material-ui/core';

import store, { history, persistor } from 'store';
import Routes from 'routes/index';
import { theme } from 'style/theme';

import registerServiceWorker from 'registerServiceWorker';

const notistackRef = React.createRef();
const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
  <StylesProvider injectFirst>
    <StyledThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider
                maxSnack={3}
                ref={notistackRef}
                action={key => (
                  <Button onClick={onClickDismiss(key)}>Dismiss</Button>
                )}
              >
                <Router history={history}>
                  <Routes />
                </Router>
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledThemeProvider>
  </StylesProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
