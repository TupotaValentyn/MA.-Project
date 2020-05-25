import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import * as serviceWorker from './serviceWorker';
import rootStore from './rootStore';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={rootStore}>
    <App />
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
