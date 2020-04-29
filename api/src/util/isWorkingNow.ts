import { RestPlace } from '../models';

export default (place: RestPlace): boolean => {
    const now = new Date();

    const dayOfWeek = now.getDay();

    return true;
};
