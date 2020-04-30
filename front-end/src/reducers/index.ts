import { combineReducers } from 'redux';
import { loginReducer } from '../slices';
import { userReducer } from '../slices/user';

const rootReducer = combineReducers({
  tokensState: loginReducer,
  userSatate: userReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

export default rootReducer;
