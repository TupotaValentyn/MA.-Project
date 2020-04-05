import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const rootStore = configureStore({
  reducer: appReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(rootSaga);

export default rootStore;
