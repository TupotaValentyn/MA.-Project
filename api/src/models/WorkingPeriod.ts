import {
    Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo,
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

    @Column
    startTime: number;

    @Column
    dayOfWeekEnd: number;

    @Column
    endTime: number;

    @BelongsTo(() => RestPlace)
    restPlace: RestPlace;
}
