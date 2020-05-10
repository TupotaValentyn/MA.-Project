import { RestDurationStaticModel } from 'index';

class RestDuration {
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
}

export default RestDuration;
