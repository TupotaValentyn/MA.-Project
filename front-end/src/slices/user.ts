import { sliceGenerator } from '../utils/sliceGenerator';

export const { reducer: userReducer, actions: userActions } = sliceGenerator(
  'user'
);

export const { userRequested }: any = userActions;
