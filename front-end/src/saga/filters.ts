import { takeEvery } from '@redux-saga/core/effects';
import { makeSaga } from '../utils/makeSaga';
import {
  getFiltersActions,
  getFiltersRequested as getFilterRequestedAction
} from '../slices/filters';
import { getFilters } from '../services/api/other/filters';

const getFiltersRequested = makeSaga(
  'getFilters',
  getFiltersActions,
  getFilters
);

export default function* filtersSaga() {
  yield takeEvery(getFilterRequestedAction.type, getFiltersRequested);
}
