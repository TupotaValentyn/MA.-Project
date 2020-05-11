import {
    AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table
} from 'sequelize-typescript';

import { RestPlaceCategory } from './RestPlaceCategory';
import { RestPlace } from './RestPlace';

@Table
export class Category extends Model<Category> {
    @PrimaryKey
    @AutoIncrement
    @Column({ primaryKey: true })
    id: number;

    @Column
    nameTextId: string;

    @Column
    googleId: string;

    @Column
    isActiveRest: boolean;

    @Column
    defaultRestDuration: number;

    @Column
    defaultRestCost: number;

    @Column
    defaultCompanySize: number;

    @BelongsToMany(() => RestPlace, () => RestPlaceCategory)
    places: RestPlace[];
}
