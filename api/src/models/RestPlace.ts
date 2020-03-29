import {
    Column, Model, Table, PrimaryKey, AutoIncrement, HasMany,
} from 'sequelize-typescript';

import { RestPlaceReview } from './RestPlaceReview';

@Table
export class RestPlace extends Model<RestPlace> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    name: string;

    @Column
    latitude: number;

    @Column
    longitude: number;

    @Column({ defaultValue: 0 })
    meanRating: number;

    @Column
    categoryId: string;

    @Column
    restDuration: string;

    @Column
    restCost: string;

    @HasMany(() => RestPlaceReview)
    reviews: RestPlaceReview[];
}
