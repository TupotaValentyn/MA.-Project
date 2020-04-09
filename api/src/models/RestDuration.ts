import {
    Column, Model, Table, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

@Table
export class RestDuration extends Model<RestDuration> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;
}
