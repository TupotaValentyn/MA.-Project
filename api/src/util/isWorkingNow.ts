import { RestPlace } from '../models';
import getWorkingPeriodForCurrentDay from './getWorkingPeriodForCurrentDay';

export default (place: RestPlace): boolean => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    if (!place.workingPeriods) {
        return false;
    }

    const currentDayPeriod = getWorkingPeriodForCurrentDay(place.workingPeriods);

    if (!currentDayPeriod) {
        return false;
    }

    if (currentDayPeriod.dayOfWeekStart === currentDayPeriod.dayOfWeekEnd) {
        return currentDayPeriod.startTime <= currentTime && currentTime <= currentDayPeriod.endTime;
    }

    return true;
};
