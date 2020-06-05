import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, FormHelperText, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { register } from '@services/api/auth/auth';
import { Alert } from '@material-ui/lab';
import {
  registerDefaultData,
  registerValidationSchema,
  Values
} from './registerData';
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
      justifyContent: 'center',
      flexBasis: '350px'
    },
    submitButton: {
      justifySelf: 'center',
      margin: '16px 0 0 0'
    },
    link: {
      marginTop: '12px'
    }
  };
});

const Register: FC<Props> = () => {
  const { formWrapper, submitButton, formClass, link } = useClasses();
  const context = useContext<AuthContext>(authContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [notificationData, setNotificationData] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (context.authenticated) {
      setLoggedIn(true);
    }
  }, [context]);

  const onSubmit = async (values: any) => {
    try {
      const { userHash } = await register(values);

      history.push({
        pathname: '/confirm-email',
        search: `?userHash=${userHash}`
      });
    } catch (error) {
      setNotificationData({
        status: 'error',
        message: error.response.data.error
      });
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik<Values>({
    initialValues: registerDefaultData,
    validationSchema: registerValidationSchema,
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
          label="Електронна пошта"
          error={handleError('email')}
          helperText={errorHintHandler('email')}
          value={values.email}
        />
        <TextField
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="password"
          type="password"
          label="Пароль"
          error={handleError('password')}
          helperText={errorHintHandler('password')}
          value={values.password}
        />
        <FormHelperText>Мінімум 8 символів</FormHelperText>
        <Button
          className={submitButton}
          color="primary"
          type="submit"
          variant="contained"
        >
          Зареєструватись
        </Button>

        <Link to="/login" className={link}>
          Увійти
        </Link>

        <Snackbar
          open={!!notificationData}
          autoHideDuration={6000}
          onClose={() => {
            setNotificationData(null);
          }}
        >
          <Alert severity={notificationData?.status}>
            {notificationData?.message}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default Register;
