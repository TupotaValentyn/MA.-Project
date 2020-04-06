import {
    Column, Model, Table, PrimaryKey, AutoIncrement, HasMany,
} from 'sequelize-typescript';

import { RestPlaceReview } from './RestPlaceReview';
import { BusinessHours } from './BusinessHours';

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

    @Column
    latitude: number;

    @Column
    longitude: number;

    @Column({ defaultValue: 0 })
    meanRating: number;

    @Column({ defaultValue: 0 })
    reviewsCount: number;

    @Column
    categoryId: string;

    @Column
    restDuration: string;

    @Column
    restCost: string;

    @Column
    isActiveRest: boolean;

    @HasMany(() => RestPlaceReview)
    reviews: RestPlaceReview[];

    @HasMany(() => BusinessHours)
    businessHours: BusinessHours[];
}