import {
    Column, Model, Table, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey,
} from 'sequelize-typescript';

import { Duration } from './Duration';
import { CompanySize } from './companySize';
import { Cost } from './Cost';

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
    defaultRestCost: Duration;

    @Column
    @ForeignKey(() => CompanySize)
    defaultCompanySizeId: number;

    @BelongsTo(() => CompanySize)
    defaultCompanySize: Duration;
}
