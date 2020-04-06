import {
    Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, DataType,
} from 'sequelize-typescript';

import { RestPlace } from './RestPlace';

@Table
export class BusinessHours extends Model<BusinessHours> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    @ForeignKey(() => RestPlace)
    placeId: number;

    @Column
    dayOfWeek: number;

    @Column({ type: DataType.TIME })
    startTime: Date;

    @Column({ type: DataType.TIME })
    endTime: Date;

    @BelongsTo(() => RestPlace)
    restPlace: RestPlace;
}
