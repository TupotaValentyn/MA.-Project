import { sliceGenerator } from '../utils/sliceGenerator';

export const { reducer: loginReducer, actions: loginActions } = sliceGenerator(
  'login'
);

export const { loginRequested } = loginActions;
