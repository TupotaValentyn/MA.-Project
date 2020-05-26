import { all } from '@redux-saga/core/effects';
import authSaga from './saga/auth';
import userSaga from './saga/user';
import filtersSaga from './saga/filters';
import placesSaga from './saga/places';

export default function* rootSaga() {
  yield all([authSaga(), userSaga(), filtersSaga(), placesSaga()]);
}
