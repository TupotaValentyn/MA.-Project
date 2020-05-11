import { CompanySizeStaticModel } from 'index';

class CompanySizes {
    static Solo = 1;

    static Little = 2;

    static Medium = 3;

    static Large = 4;

    private static sizes: CompanySizeStaticModel[];

    public static getAll(): CompanySizeStaticModel[] {
        if (this.sizes) {
            return this.sizes;
        }

        this.sizes = ['solo', 'little', 'medium', 'large']
            .map((durationValue, index) => ({ id: index + 1, nameTextId: `restCost.${durationValue}` }));

        return this.sizes;
    }
}

export default CompanySizes;
