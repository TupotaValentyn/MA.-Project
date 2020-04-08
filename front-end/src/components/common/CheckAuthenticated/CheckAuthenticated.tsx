import React, { FC, useContext } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import authContext, { AuthContext } from '../../../context/authContext';
import { commonRoutes } from '../../../routes';

type Props = {};

const CheckAuthenticated: FC<Props> = () => {
  const { authenticated, toLoginRedirect } = useContext<AuthContext>(
    authContext
  );

  const location = useLocation();

  const route = commonRoutes.find((route) => {
    return matchPath(location.pathname, route);
  });

  console.log(authenticated);
  return route || authenticated ? null : toLoginRedirect();
};

export default CheckAuthenticated;
