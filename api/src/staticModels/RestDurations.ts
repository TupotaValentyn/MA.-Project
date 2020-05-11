import { RestDurationStaticModel } from 'index';

class RestDurations {
    static Low = 1;

    static Medium = 2;

    static High = 3;

    private static durations: RestDurationStaticModel[];

    public static getAll(): RestDurationStaticModel[] {
        if (this.durations) {
            return this.durations;
        }

        this.durations = ['low', 'medium', 'high']
            .map((durationValue, index) => ({ id: index + 1, nameTextId: `restDuration.${durationValue}` }));

        return this.durations;
    }

    public static isValid(duration: number): boolean {
        return duration >= RestDurations.Low && duration <= RestDurations.High;
    }

    public static findById(id: number): RestDurationStaticModel {
        return this.getAll().find((item) => item.id === id);
    }
}

export default RestDurations;
