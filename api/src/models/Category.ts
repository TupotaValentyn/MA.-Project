import {
    Column, Model, Table, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey, BelongsToMany,
} from 'sequelize-typescript';

import { Duration } from './Duration';
import { CompanySize } from './CompanySize';
import { Cost } from './Cost';
import { RestPlaceCategory } from './RestPlaceCategory';
import { RestPlace } from './RestPlace';

@Table
export class Category extends Model<Category> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;

    @Column
    googleId: string;

    @Column
    isActiveRest: boolean;

    @Column
    @ForeignKey(() => Duration)
    defaultRestDurationId: number;

    @BelongsTo(() => Duration)
    defaultRestDuration: Duration;

    @Column
    @ForeignKey(() => Cost)
    defaultRestCostId: number;

    @BelongsTo(() => Cost)
    defaultRestCost: Cost;

    @Column
    @ForeignKey(() => CompanySize)
    defaultCompanySizeId: number;

    @BelongsTo(() => CompanySize)
    defaultCompanySize: CompanySize;

    @BelongsToMany(() => RestPlace, () => RestPlaceCategory)
    places: RestPlace[];
}
