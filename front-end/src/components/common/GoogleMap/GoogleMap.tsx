import React, { FC, useState } from 'react';
import ReactMapGL from 'react-map-gl';

type Props = { google?: any };

const GoogleMaps: FC<Props> = ({ ...props }) => {
  const [state, setState] = useState({
    viewport: {
      width: '100%',
      height: '80%',
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  });
  return (
    <ReactMapGL
      mapboxApiAccessToken="pk.eyJ1IjoidHVwb3RhdmFsZW50eW4iLCJhIjoiY2s4cmZ6dW1uMDZoODNvcDlxcm9ocG82cyJ9.tk6lNmtv4lO6RTwPjlq4vw"
      {...state.viewport}
      onViewportChange={(viewport) => setState({ viewport } as any)}
    />
  );
};

export default GoogleMaps;
