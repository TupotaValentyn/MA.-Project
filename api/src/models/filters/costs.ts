import { translateText } from '../../util';

export enum Costs { Free, Inexpensive, Moderate, Expensive, VeryExpensive }

export const getAllCosts = (locale: string = 'ru'): Map<Costs, string> => new Map<number, string>([
    [Costs.Free, translateText('costs.free', locale)],
    [Costs.Inexpensive, translateText('costs.inexpensive', locale)],
    [Costs.Moderate, translateText('costs.moderate', locale)],
    [Costs.Expensive, translateText('costs.expensive', locale)],
    [Costs.VeryExpensive, translateText('costs.veryExpensive', locale)],
]);
