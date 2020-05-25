import { combineReducers } from 'redux';
import { loginReducer } from '../slices';
import { userReducer } from '../slices/user';
import { getFiltersReducer } from '../slices/filters';
import { getPlacesReducer } from '../slices/places';

const rootReducer = combineReducers({
  tokensState: loginReducer,
  userSatate: userReducer,
  filtersState: getFiltersReducer,
  placesState: getPlacesReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

export default rootReducer;
