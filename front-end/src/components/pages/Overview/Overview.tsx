import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import GoogleMaps from '../../common/GoogleMap';
import { RootStore } from '../../../reducers';
import { State, StateStatuses } from '../../../utils/State';
import { userRequested } from '../../../slices/user';
import { getFiltersRequested } from '../../../slices/filters';
import { getPlacesRequested } from '../../../slices/places';
import Filters from '../../common/Filters';

type Props = {};

const useClasses = makeStyles({
  mapWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex'
  }
});

type SelfLocationType = {
  lat: number;
  lng: number;
};

const Overview: FC<Props> = () => {
  const dispatch = useDispatch();
  const { mapWrapper } = useClasses();
  const tokensState = useSelector<RootStore, State<any>>((store) => {
    return store.tokensState;
  });

  const [selfLocation, setSelfLocation] = useState<SelfLocationType>({
    lng: 0,
    lat: 0
  });

  useEffect(() => {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const {
          coords: { latitude, longitude }
        } = position;
        setSelfLocation({ lat: latitude, lng: longitude });
      });
    }, 3000);
  }, []);

  useEffect(() => {
    if (tokensState.status === StateStatuses.LOADED) {
      const { token } = tokensState.payload.tokenData;
      dispatch(userRequested(token));
      dispatch(getFiltersRequested());
      dispatch(getPlacesRequested());
    }
  }, []);

  return (
    <div className={mapWrapper}>
      <GoogleMaps selfPosition={selfLocation} />
      <Filters selfPosition={selfLocation} />
    </div>
  );
};

export default Overview;
