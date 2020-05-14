class PlaceConfirmedStatuses {
    static Confirmed = 1;

    static New = 0;

    public static isValid(status: number): boolean {
        return status === PlaceConfirmedStatuses.Confirmed || status === PlaceConfirmedStatuses.New;
    }
}

export default PlaceConfirmedStatuses;
