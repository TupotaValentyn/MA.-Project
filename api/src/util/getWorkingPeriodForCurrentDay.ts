import { WorkingPeriod } from '../models';

export default (workingPeriods: WorkingPeriod[]) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    if (!workingPeriods) {
        return null;
    }

    return workingPeriods.find((workingPeriod) => {
        const isAfterBeginning = dayOfWeek === workingPeriod.dayOfWeekStart && workingPeriod.startTime <= currentTime;
        const isBeforeEnding = dayOfWeek === workingPeriod.dayOfWeekEnd && workingPeriod.endTime >= currentTime;

        return isAfterBeginning || isBeforeEnding;
    });
};
