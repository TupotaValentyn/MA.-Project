import { sliceGenerator } from '../utils/sliceGenerator';

export const {
  reducer: getFiltersReducer,
  actions: getFiltersActions
} = sliceGenerator('getFilters');

export const { getFiltersRequested }: any = getFiltersActions;
