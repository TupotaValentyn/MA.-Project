import {
    Column, Model, Table, PrimaryKey, AutoIncrement,
} from 'sequelize-typescript';

@Table
export class Cost extends Model<Cost> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;
}
