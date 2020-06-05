import { sliceGenerator } from '../utils/sliceGenerator';
import { checkEmailVerification } from '../services/api/auth/auth';

export const { reducer: loginReducer, actions: loginActions } = sliceGenerator(
  'login'
);

export const { loginRequested }: any = loginActions;

export const {
  reducer: checkEmailVerificationReducer,
  actions: checkEmailVerificationActions
} = sliceGenerator('checkEmailVerification');

export const {
  checkEmailVerificationRequested
}: any = checkEmailVerificationActions;
