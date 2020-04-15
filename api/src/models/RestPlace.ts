import {
    Column, Model, Table, PrimaryKey, AutoIncrement, HasMany, BelongsToMany, DataType,
} from 'sequelize-typescript';

import { Review } from './Review';
import { WorkingPeriod } from './WorkingPeriod';
import { Category } from './Category';
import { RestPlaceCategory } from './RestPlaceCategory';

// - времени (час/два/весь день), которое человек хочет провести там,
// - кол-ву денег, которые может потратить
// - по дистанции до этого места (1км/5км/весь город и т.д)
// - по размеру компании (один чел/2/3/10)
// - активный/пассивный отдых
// - открыто сейчас

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
    restDuration: number;

    @Column
    restCost: number;

    @Column
    companySize: number;

    @Column
    isActiveRest: boolean;

    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => WorkingPeriod)
    businessHours: WorkingPeriod[];

    @BelongsToMany(() => Category, () => RestPlaceCategory)
    categories: Category[];
}
