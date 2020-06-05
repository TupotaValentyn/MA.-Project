import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, FormHelperText, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { checkEmailVerification, resendEmail } from '@services/api/auth/auth';
import { Alert } from '@material-ui/lab';
import { tokensProvider } from '@services/api';
import authContext, { AuthContext } from '../../../context/authContext';
import AfterLoginRedirect from '../../common/AfterLoginRedirect/AfterLoginRedirect';
import { TokenData } from '../../../../../api/src/types';

type Props = {};

const useClasses = makeStyles(() => {
  return {
    formWrapper: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formContent: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '600px'
    },
    buttonsBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '12px'
    },
    resendButton: {
      marginTop: '6px'
    },
    link: {
      marginTop: '12px'
    }
  };
});

const ConfirmEmail: FC<Props> = () => {
  const {
    formWrapper,
    formContent,
    buttonsBlock,
    resendButton,
    link
  } = useClasses();
  const context = useContext<AuthContext>(authContext);
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const { search } = history.location;
  const queryUserHash = search.split('=')[1] || '';

  const [userHash, setUserHash] = useState(queryUserHash);

  const checkVerification = async () => {
    setNotificationData(null);

    try {
      const { tokenData } = await checkEmailVerification({
        userHash
      });

      if (tokenData) {
        tokensProvider.saveTokens(tokenData as TokenData);
        history.push('/');
      } else {
        setNotificationData({
          status: 'error',
          message: 'Пошта не підтверджена'
        });
      }
    } catch (error) {
      setNotificationData({
        status: 'error',
        message: error.response.data.error
      });
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setNotificationData(null);

      const { userHash: newUserHash } = await resendEmail({
        userHash
      });

      setUserHash(newUserHash);

      setNotificationData({
        status: 'success',
        message: 'Листа відправлено повторно'
      });
    } catch (error) {
      setNotificationData({
        status: 'error',
        message: error.response.data.error
      });
    }
  };

  useEffect(() => {
    if (context.authenticated) {
      setLoggedIn(true);
    }
  }, [context]);

  return loggedIn ? (
    <AfterLoginRedirect />
  ) : (
    <div className={formWrapper}>
      <div className={formContent}>
        <p>
          Ви успішно зареєструвались в системі. На Вашу поштову скриньку було
          відправлено листа з посиланням для підтверждення електронної пошти.
          Перейдіть за посиланням і натисніть кнопку&nbsp;
          <b>Перевірити підтверждення</b>
        </p>
        <div className={buttonsBlock}>
          <Button
            color="primary"
            type="button"
            variant="contained"
            onClick={checkVerification}
          >
            Перевірити підтверждення
          </Button>

          <Button
            color="secondary"
            className={resendButton}
            type="button"
            variant="contained"
            onClick={resendVerificationEmail}
          >
            Відправити повторно
          </Button>
        </div>

        <Link to="/login" className={link}>
          Перейти на сторінку входу
        </Link>

        {userHash}

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
      </div>
    </div>
  );
};

export default ConfirmEmail;
