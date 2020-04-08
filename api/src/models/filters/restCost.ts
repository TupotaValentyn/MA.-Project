export enum RestCost { Free, Inexpensive, Moderate, Expensive, VeryExpensive }

export const getAllCosts = (locale: string = 'ru'): Map<RestCost, string> => new Map<RestCost, string>([
    [RestCost.Free, 'restCost.free'],
    [RestCost.Inexpensive, 'restCost.inexpensive'],
    [RestCost.Moderate, 'restCost.moderate'],
    [RestCost.Expensive, 'restCost.expensive'],
    [RestCost.VeryExpensive, 'restCost.veryExpensive'],
]);
