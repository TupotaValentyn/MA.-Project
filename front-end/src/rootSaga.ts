import { all } from '@redux-saga/core/effects';
import authSaga from './saga/auth';
import userSaga from './saga/user';

export default function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}
