import { translateText } from '../../util';

export enum CompanySizes { Low, Medium, High }

export const getAllCompanySizes = (locale: string = 'ru'): Map<CompanySizes, string> => new Map<number, string>([
    [CompanySizes.Low, translateText('companySizes.low', locale)],
    [CompanySizes.Medium, translateText('companySizes.medium', locale)],
    [CompanySizes.High, translateText('companySizes.high', locale)],
]);
