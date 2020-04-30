import { takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  userActions,
  userRequested as userRequestedAction
} from '../slices/user';
import { user } from '../services/api/user/user';

const loginRequested = makeSaga('user', userActions, user);

export default function* userSaga() {
  yield takeEvery(userRequestedAction.type, loginRequested);
}
