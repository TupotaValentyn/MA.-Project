import {
    Column, Model, Table, PrimaryKey, AutoIncrement, HasMany, BelongsToMany, DataType,
} from 'sequelize-typescript';

import { Review } from './Review';
import { WorkingPeriod } from './WorkingPeriod';
import { Category } from './Category';
import { RestPlaceCategory } from './RestPlaceCategory';

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
    totalRating: number;

    @Column({ defaultValue: 0 })
    reviewsCount: number;

    @Column
    isActiveRest: boolean;

    @Column
    restDuration: number;

    @Column
    restCost: number;

    @Column
    companySize: number;

    @Column({ defaultValue: true })
    confirmed: boolean;

    @Column({ defaultValue: false })
    manuallyUpdated: boolean;

    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => WorkingPeriod)
    workingPeriods: WorkingPeriod[];

    @BelongsToMany(() => Category, () => RestPlaceCategory)
    categories: Category[];
}
