import {
    Column, Model, Table, PrimaryKey, AutoIncrement, HasMany, BelongsToMany, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';

import { Review } from './Review';
import { WorkingPeriod } from './WorkingPeriod';
import { Category } from './Category';
import { RestPlaceCategory } from './RestPlaceCategory';
import { Duration } from './Duration';
import { Cost } from './Cost';
import { CompanySize } from './CompanySize';

@Table
export class RestPlace extends Model<RestPlace> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    googleId: string;

    @Column
    name: string;

    @Column({ type: DataType.DOUBLE })
    latitude: number;

    @Column({ type: DataType.DOUBLE })
    longitude: number;

    @Column({ defaultValue: 0, type: DataType.DOUBLE })
    googleMeanRating: number;

    @Column({ defaultValue: 0 })
    googleReviewsCount: number;

    @Column({ defaultValue: 0, type: DataType.DOUBLE })
    meanRating: number;

    @Column({ defaultValue: 0 })
    reviewsCount: number;

    @Column
    isActiveRest: boolean;

    @Column
    @ForeignKey(() => Duration)
    restDurationId: number;

    @BelongsTo(() => Duration)
    restDuration: Duration;

    @Column
    @ForeignKey(() => Cost)
    restCostId: number;

    @BelongsTo(() => Cost)
    restCost: Cost;

    @Column
    @ForeignKey(() => CompanySize)
    companySizeId: number;

    @BelongsTo(() => CompanySize)
    companySize: CompanySize;

    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => WorkingPeriod)
    workingPeriods: WorkingPeriod[];

    @BelongsToMany(() => Category, () => RestPlaceCategory)
    categories: Category[];
}
