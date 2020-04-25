import {
    Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, DataType,
} from 'sequelize-typescript';

import { RestPlace } from './RestPlace';

@Table
export class WorkingPeriod extends Model<WorkingPeriod> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    @ForeignKey(() => RestPlace)
    placeId: number;

    @Column
    dayOfWeekStart: number;

    @Column({ type: DataType.TIME })
    startTime: Date;

    @Column
    dayOfWeekEnd: number;

    @Column({ type: DataType.TIME })
    endTime: Date;

    @BelongsTo(() => RestPlace)
    restPlace: RestPlace;
}
