import { combineReducers } from 'redux';
import { loginReducer } from '../slices';

const rootReducer = combineReducers({
  tokensState: loginReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

export default rootReducer;
