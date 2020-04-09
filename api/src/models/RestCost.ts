import {
    Column, Model, Table, PrimaryKey, AutoIncrement,
} from 'sequelize-typescript';

@Table
export class RestCost extends Model<RestCost> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;
}
