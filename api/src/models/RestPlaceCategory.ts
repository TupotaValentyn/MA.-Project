import {
    Column, Model, Table, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey,
} from 'sequelize-typescript';

import { RestDuration } from './RestDuration';
import { CompanySize } from './companySize';
import { RestCost } from './RestCost';

@Table
export class RestPlaceCategory extends Model<RestPlaceCategory> {
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
    @ForeignKey(() => RestDuration)
    defaultRestDurationId: number;

    @BelongsTo(() => RestDuration)
    defaultRestDuration: RestDuration;

    @Column
    @ForeignKey(() => RestCost)
    defaultRestCostId: number;

    @BelongsTo(() => RestCost)
    defaultRestCost: RestDuration;

    @Column
    @ForeignKey(() => CompanySize)
    defaultCompanySizeId: number;

    @BelongsTo(() => CompanySize)
    defaultCompanySize: RestDuration;
}
