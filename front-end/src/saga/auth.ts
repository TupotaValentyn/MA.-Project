import { all, takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  checkEmailVerificationActions,
  checkEmailVerificationRequested as checkEmailVerificationRequestedAction,
  googleAuthActions,
  loginActions,
  loginRequested as loginRequestedAction
} from '../slices/auth';
import { checkEmailVerification, login } from '../services/api/auth/auth';

const loginRequested = makeSaga('login', loginActions, login);

const checkEmailVerificationRequested = makeSaga(
  'checkEmailVerification',
  checkEmailVerificationActions,
  checkEmailVerification
);

const googleAuthRequested = makeSaga(
  'googleAuth',
  googleAuthActions,
  checkEmailVerification
);

export default function* authSaga() {
  yield all([
    takeEvery(loginRequestedAction.type, loginRequested),
    takeEvery(
      checkEmailVerificationRequestedAction.type,
      checkEmailVerificationRequested
    )
  ]);
}
