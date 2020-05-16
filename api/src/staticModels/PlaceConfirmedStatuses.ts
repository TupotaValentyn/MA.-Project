class PlaceConfirmedStatuses {
    static Confirmed = 1;

    static New = 2;

    public static isValid(status: number): boolean {
        return status === PlaceConfirmedStatuses.Confirmed || status === PlaceConfirmedStatuses.New;
    }
}

export default PlaceConfirmedStatuses;
