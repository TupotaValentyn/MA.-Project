export enum RestDuration { Low, Medium, High }

export const getAllDurations = (locale: string = 'ru'): Map<RestDuration, string> => new Map<RestDuration, string>([
    [RestDuration.Low, 'restDuration.low'],
    [RestDuration.Medium, 'restDuration.medium'],
    [RestDuration.High, 'restDuration.high'],
]);
