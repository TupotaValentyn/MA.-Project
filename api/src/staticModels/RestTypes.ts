class RestTypes {
    static Active = 1;

    static Passive = 2;

    public static isValid(restType: number): boolean {
        return restType === RestTypes.Active || restType === RestTypes.Passive;
    }
}

export default RestTypes;
