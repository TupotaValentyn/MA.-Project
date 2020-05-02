import { RestPlace } from '../models';

export default (place: RestPlace): boolean => {
    const now = new Date();

    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const currentDayPeriod = place.workingPeriods.find((workingPeriod) => {
        const isAfterBeginning = dayOfWeek === workingPeriod.dayOfWeekStart && workingPeriod.startTime <= currentTime;
        const isBeforeEnding = dayOfWeek === workingPeriod.dayOfWeekEnd && workingPeriod.endTime >= currentTime;

        return isAfterBeginning || isBeforeEnding;
    });

    if (!currentDayPeriod) {
        return false;
    }

    if (currentDayPeriod.dayOfWeekStart === currentDayPeriod.dayOfWeekEnd) {
        return currentDayPeriod.startTime <= currentTime && currentTime <= currentDayPeriod.endTime;
    }

    return true;
};
