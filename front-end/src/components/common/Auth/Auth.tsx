import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootStore } from '../../../reducers';
import { AuthContext, AuthProvider } from '../../../context/authContext';
import { State, StateStatuses } from '../../../utils/State';
import { tokensProvider } from '../../../services/api';
import { ROUTES } from '../../../routes';

type Props = {};
const initAuthState = {
  authenticated: false,
  isAdmin: false,
  toLoginRedirect: () => {},
  toLogoutRedirect: () => {}
};

const Auth: FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useState(initAuthState);
  const dispatch = useDispatch();

  const loginState = useSelector<RootStore, State<any>>(
    (state) => state.tokensState
  );

  useEffect(() => {
    if (loginState.status === StateStatuses.LOADED) {
      const tokens = loginState.payload.tokenData;

      tokensProvider.saveTokens(tokens);
      setAuthState((prevState) => {
        return {
          ...prevState,
          authenticated: true,
          token: loginState.payload.tokenData,
          isAdmin: false
        };
      });
    }
  }, [loginState]);

  const toLoginRedirect = () => {
    return <Redirect to={`${ROUTES.LOGIN}`} />;
  };

  const toLogoutRedirect = () => {
    tokensProvider.removeTokens();
  };

  const authValues = {
    ...authState,
    toLoginRedirect,
    toLogoutRedirect
  };

  console.log(authValues);

  return <AuthProvider value={authValues}>{children}</AuthProvider>;
};

export default Auth;
