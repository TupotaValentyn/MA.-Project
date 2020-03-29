import {
    Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, DataType
} from 'sequelize-typescript';

import { RestPlace } from './RestPlace';

@Table
export class RestPlaceReview extends Model<RestPlaceReview> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    @ForeignKey(() => RestPlace)
    restPlaceId: Number;

    @Column({ type: DataType.TEXT })
    review: string;

    @Column
    rating: number;

    @BelongsTo(() => RestPlace)
    restPlace: RestPlace;
}
