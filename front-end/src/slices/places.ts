import { sliceGenerator } from '../utils/sliceGenerator';

export const {
  reducer: getPlacesReducer,
  actions: getPlacesActions
} = sliceGenerator('getPlaces');

export const { getPlacesRequested }: any = getPlacesActions;
