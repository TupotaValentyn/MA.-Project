import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import GoogleMaps from '../../common/GoogleMap/GoogleMap';
import { RootStore } from '../../../reducers';
import { State, StateStatuses } from '../../../utils/State';
import { userRequested } from '../../../slices/user';

type Props = {};

const useClasses = makeStyles({
  mapWrapper: {
    height: '100%',
    width: '100%'
  }
});

const Overview: FC<Props> = () => {
  const dispatch = useDispatch();
  const { mapWrapper } = useClasses();
  const tokensState = useSelector<RootStore, State<any>>((store) => {
    return store.tokensState;
  });

  useEffect(() => {
    if (tokensState.status === StateStatuses.LOADED) {
      const { token } = tokensState.payload.tokenData;
      dispatch(userRequested(token));
    }
  }, []);

  return (
    <div className={mapWrapper}>
      <GoogleMaps />
    </div>
  );
};

export default Overview;
