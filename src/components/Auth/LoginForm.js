import React from 'react';
import styled from 'styled-components';
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  colors,
  FormControl,
  FormHelperText,
  // FormControlLabel,
  // Checkbox,
  // Link,
} from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_person as icPerson } from 'react-icons-kit/md/ic_person';
import { ic_lock as icLock } from 'react-icons-kit/md/ic_lock';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

const Wrapper = styled.div`
  width: 100%;

  .heading {
    margin: 30px;
    font-size: 1.5rem;
  }

  .MuiCardContent-root {
    padding: 10%;
  }

  .textfield {
    background-color: rgba(0, 0, 0, 0.09);

    .MuiFormHelperText-contained {
      margin: 0px;
      padding: 2px 14px;
      background-color: white;
    }
  }

  .rememberMe {
    margin: 0.09% 0 0 0;
  }

  .rememberMe,
  .forgotPass {
    font-size: 0.8rem;
  }

  .custButton {
    text-transform: none;
    padding: 10px;
    font-size: 1.2rem;
  }

  .progressCircular {
    color: ${colors.grey[500]};
  }
`;

const Form = props => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    auth: { loginFormErrors, authLoader },
  } = props;

  return (
    <Wrapper>
      <div className="d-flex flex-column align-items-center MuiCardContent-root">
        <p className="heading">Sign in</p>
        <form onSubmit={handleSubmit}>
          <TextField
            id="email"
            className="textfield"
            variant="outlined"
            type="email"
            placeholder="Email Address"
            autoComplete="emailAddress"
            size="medium"
            value={values.email}
            error={touched.email && !!errors.email}
            helperText={errors.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon={icPerson} size={21} />
                </InputAdornment>
              ),
            }}
            fullWidth
            autoFocus
          />
          <TextField
            id="password"
            className="textfield"
            variant="outlined"
            margin="normal"
            name="password"
            placeholder="Password"
            size="medium"
            type="password"
            autoComplete="current-password"
            value={values.password}
            error={touched.password && !!errors.password}
            helperText={errors.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon={icLock} size={21} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <div className="w-100 mt-3 mb-2">
            <Button
              className="custButton"
              variant="contained"
              color="primary"
              type="submit"
              disabled={authLoader.submit}
              fullWidth
            >
              {!authLoader.submit ? (
                'Login'
              ) : (
                <div className="d-flex flex-row align-items-center">
                  <span className="pr-2">Processing</span>
                  <CircularProgress size={25} className="progressCircular" />
                </div>
              )}
            </Button>
          </div>
          <FormControl error={!isEmpty(loginFormErrors)}>
            <FormHelperText>{loginFormErrors.message}</FormHelperText>
          </FormControl>
          {/* <div className="d-flex flex-row justify-content-between align-items-center mt-2">
            <FormControlLabel
              className="remember-me"
              control={<Checkbox value="remember" color="primary" />}
              label={<span className="rememberMe">Remember Me</span>}
            />
            <Link className="forgotPass" href="#" variant="body2">
              Forgot Password?
            </Link>
          </div> */}
        </form>
      </div>
    </Wrapper>
  );
};

Form.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const FormikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required()
      .label('Email'),
    password: Yup.string()
      .required()
      .label('Password'),
  }),
  mapPropsToValues: ({ form }) => ({
    ...form,
  }),
  handleSubmit: (payload, bag) => {
    const {
      props: { handleSubmit },
    } = bag;
    handleSubmit({
      ...payload,
      grantType: 'password',
    });
  },
  displayName: 'Login form',
});

const LoginForm = FormikEnhancer(Form);

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(LoginForm);
