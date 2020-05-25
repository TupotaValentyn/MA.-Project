import {
    Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, DataType
} from 'sequelize-typescript';

import { RestPlace, User } from './index';

@Table
export class Review extends Model<Review> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column({ type: DataType.TEXT })
    comment: string;

    @Column
    rating: number;

    @Column
    created: number;

    @Column
    @ForeignKey(() => RestPlace)
    restPlaceId: number;

    @BelongsTo(() => RestPlace)
    restPlace: RestPlace;

    @Column
    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
