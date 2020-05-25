import React, { FC, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { useSelector } from 'react-redux';
import { StateStatuses } from '../../../utils/State';
import Tooltip from './Tooltip/Tooltip';

type Props = {};

const Map: FC<Props> = () => {
  const response = useSelector((store: any) => store.placesState);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (response.status === StateStatuses.LOADED) {
      setPoints(response.payload.places);
    }
  }, [response]);

  return (
    <div style={{ height: '100vh', width: '80%' }}>
      <GoogleMapReact
        // bootstrapURLKeys={{ key: 'AIzaSyDVTycMkhBNuW6y7KF--HOYze6L-a5OQOk' }}
        bootstrapURLKeys={{ key: 'AIzaSyDRyf29LX_icEKctrk9-RFAxenzdUoTzKQ' }}
        defaultCenter={{ lng: 32.02, lat: 49.4174 }}
        defaultZoom={13}
      >
        {(points.length > 0 &&
          points.map((marker: any) => {
            return (
              <Tooltip
                lat={marker.latitude}
                lng={marker.longitude}
                marker={marker}
              />
            );
          })) || <span>test</span>}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
