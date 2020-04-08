import { all } from '@redux-saga/core/effects';
import authSaga from './saga/auth';

export default function* rootSaga() {
  yield all([authSaga()]);
}
