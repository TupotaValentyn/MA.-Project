import React from 'react';
import mapboxgl from 'mapbox-gl';
import './index.css';

type Props = { google?: any };
mapboxgl.accessToken =
  'pk.eyJ1IjoidHVwb3RhdmFsZW50eW4iLCJhIjoiY2thM3V3Y2ZkMDdyZTNmbXZocWtoZ2ZmcyJ9.udLTQEIdhE94A-ZFMI4kuw';

class GoogleMaps extends React.Component {
  mapRef = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 32.02,
      lat: 49.4174,
      zoom: 11
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state as any;

    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    } as any);

    map.on('move', () => {
      const { lng: lngg, lat: latt } = map.getCenter();

      this.setState({
        lng: lngg.toFixed(4),
        lat: latt.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    const { lng, lat, zoom } = this.state as any;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={this.mapRef as any}
          className="absolute top right left bottom"
        />
      </div>
    );
  }
}

export default GoogleMaps;
