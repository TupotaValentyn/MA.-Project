import {
    Column, Model, Table, AllowNull, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

/**
 * !@swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: number
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *         format: password
 *         nullable: true
 *       googleId:
 *         type: string
 *         nullable: true
 *       facebookId:
 *         type: string
 *         nullable: true
 *       isAdmin:
 *         type: boolean
 *       isConfirmed:
 *         type: boolean
 */

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

    @AllowNull(true)
    @Column
    userHash: string;

    @Column({ defaultValue: false })
    isAdmin: boolean;

    @Column({ defaultValue: false })
    isConfirmed: boolean;
}
