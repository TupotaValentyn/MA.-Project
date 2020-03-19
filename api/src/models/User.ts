import {Column, Model, Table, AllowNull, PrimaryKey, AutoIncrement} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @AllowNull(true)
    @Column
    email: string;

    @AllowNull(true)
    @Column
    password: string;

    @AllowNull(true)
    @Column
    googleId: string;

    @AllowNull(true)
    @Column
    facebookId: string;

    @Column({ defaultValue: false })
    active: boolean;
}
