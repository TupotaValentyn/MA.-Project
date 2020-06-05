import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Snackbar } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { resendEmail } from '@services/api/auth/auth';
import { Alert } from '@material-ui/lab';
import { checkEmailVerificationRequested } from '../../../slices/auth';
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

  const dispatch = useDispatch();
  const { search } = history.location;
  const queryUserHash = search.split('=')[1] || '';

  const [userHash, setUserHash] = useState(queryUserHash);

  const checkVerification = async () => {
    setNotificationData(null);

    dispatch(
      checkEmailVerificationRequested({
        userHash
      })
    );
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
