import { translateText } from '../../util';

export enum Durations { Low, Medium, High }

export const getAllDurations = (locale: string = 'ru'): Map<Durations, string> => new Map<number, string>([
    [Durations.Low, translateText('durations.low', locale)],
    [Durations.Medium, translateText('durations.medium', locale)],
    [Durations.High, translateText('durations.high', locale)],
]);
