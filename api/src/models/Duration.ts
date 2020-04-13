import {
    Column, Model, Table, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

@Table
export class Duration extends Model<Duration> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;
}
