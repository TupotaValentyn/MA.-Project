import React, { FC, useCallback } from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { loginDefaultData, loginValidationSchema, Values } from './loginData';
import { login } from '../../../services/api/auth/auth';

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

  const onSubmit = (values: any) => {
    login(values);
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

  return (
    <div className={formWrapper}>
      <form onSubmit={handleSubmit} className={formClass}>
        <TextField
          name="login"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="login"
          type="text"
          label="Login"
          error={handleError('login')}
          helperText={errorHintHandler('login')}
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
