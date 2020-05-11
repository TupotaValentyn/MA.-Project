import { takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  getFiltersActions,
  getFiltersRequested as getFilterRequestedAction
} from '../slices/filters';
import { getPlaces } from '../services/api/other/places';

const getFiltersRequested = makeSaga('getPlaces', getFiltersActions, getPlaces);

export default function* placesSaga() {
  yield takeEvery(getFilterRequestedAction.type, getFiltersRequested);
}
