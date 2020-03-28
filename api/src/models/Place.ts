import {
    Column, Model, Table, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;
}
