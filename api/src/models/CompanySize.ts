import {
    Column, Model, Table, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

@Table
export class CompanySize extends Model<CompanySize> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;
}
