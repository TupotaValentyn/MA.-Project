import { takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  loginActions,
  loginRequested as loginRequestedAction
} from '../slices/auth';
import { login } from '../services/api/auth/auth';

const loginRequested = makeSaga('login', loginActions, login);

export default function* authSaga() {
  yield takeEvery(loginRequestedAction.type, loginRequested);
}
