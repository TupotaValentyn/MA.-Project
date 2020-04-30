import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../../routes';
import { RootStore } from '../../../reducers';
import { State, StateStatuses } from '../../../utils/State';

type Props = {};

const AfterLoginRedirect: FC<Props> = () => {
  const returnUrl = ROUTES.OVERVIEW;
  const tokensState = useSelector<RootStore, State<any>>(
    (store) => store.tokensState
  );
  const history = useHistory();
  useEffect(() => {
    if (tokensState.status === StateStatuses.LOADED) {
      console.log('text');
      history.push(returnUrl);
    }
  }, [tokensState]);

  return null;
};

export default AfterLoginRedirect;
