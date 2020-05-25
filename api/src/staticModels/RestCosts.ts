import { RestCostStaticModel } from 'index';

class RestCosts {
    static Free = 1;

    static Inexpensive = 2;

    static Moderate = 3;

    static Expensive = 4;

    static VeryExpensive = 5;

    private static costs: RestCostStaticModel[];

    public static getAll(): RestCostStaticModel[] {
        if (this.costs) {
            return this.costs;
        }

        this.costs = ['free', 'inexpensive', 'moderate', 'expensive', 'veryExpensive']
            .map((durationValue, index) => ({ id: index + 1, nameTextId: `restCost.${durationValue}` }));

        return this.costs;
    }

    public static isValid(cost: number): boolean {
        return cost >= RestCosts.Free && cost <= RestCosts.VeryExpensive;
    }

    public static findById(id: number): RestCostStaticModel {
        return this.getAll().find((item) => item.id === id);
    }
}

export default RestCosts;
