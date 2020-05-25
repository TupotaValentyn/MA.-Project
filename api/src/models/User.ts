import {
    Column, Model, Table, AllowNull, PrimaryKey, AutoIncrement, HasMany,
} from 'sequelize-typescript';

import config from '../config';
import { Review } from './Review';

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

    @Column({ defaultValue: config.DEFAULT_LOCALE })
    locale: string;

    @AllowNull(true)
    @Column
    userHash: string;

    @Column({ defaultValue: false })
    isAdmin: boolean;

    @Column({ defaultValue: false })
    isConfirmed: boolean;

    @HasMany(() => Review)
    reviews: Review[];
}
