import { takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  getPlacesActions,
  getPlacesRequested as getPlacesRequestedAction
} from '../slices/places';
import { getPlaces } from '../services/api/other/places';

const getFiltersRequested = makeSaga('getPlaces', getPlacesActions, getPlaces);

export default function* placesSaga() {
  yield takeEvery(getPlacesRequestedAction.type, getFiltersRequested);
}
