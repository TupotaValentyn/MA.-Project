import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { loginDefaultData, loginValidationSchema, Values } from './loginData';
import { loginRequested } from '../../../slices';
import { useDispatch } from 'react-redux';
import authContext, { AuthContext } from '../../../context/authContext';
import AfterLoginRedirect from '../../common/AfterLoginRedirect/AfterLoginRedirect';

type Props = {};

const useClasses = makeStyles(() => {
  return {
    formWrapper: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formClass: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    submitButton: {
      justifySelf: 'center',
      margin: '16px 0 0 0'
    }
  };
});

const Login: FC<Props> = () => {
  const { formWrapper, submitButton, formClass } = useClasses();
  const dispatch = useDispatch();
  const context = useContext<AuthContext>(authContext);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (context.authenticated) {
      setLoggedIn(true);
    }
  }, [context]);

  const onSubmit = (values: any) => {
    dispatch(loginRequested(values));
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik<Values>({
    initialValues: loginDefaultData,
    validationSchema: loginValidationSchema,
    onSubmit
  });

  const handleError = useCallback(
    (field: string): boolean => {
      return (errors[field] && touched[field]) as boolean;
    },
    [errors, touched]
  );

  const errorHintHandler = useCallback(
    (field: string): string => {
      return handleError ? (errors[field] as string) : '';
    },
    [errors, touched]
  );

  return loggedIn ? (
    <AfterLoginRedirect />
  ) : (
    <div className={formWrapper}>
      <form onSubmit={handleSubmit} className={formClass}>
        <TextField
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="email"
          type="text"
          label="Login"
          error={handleError('email')}
          helperText={errorHintHandler('email')}
          value={values.login}
        />
        <TextField
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="password"
          type="password"
          label="Password"
          error={handleError('password')}
          helperText={errorHintHandler('password')}
          value={values.password}
        />
        <Button
          className={submitButton}
          color="primary"
          type="submit"
          variant="contained"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default Login;
