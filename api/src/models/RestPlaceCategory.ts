import {
    AutoIncrement,
    Column, ForeignKey, Model, PrimaryKey, Table,
} from 'sequelize-typescript';

import { RestPlace } from './RestPlace';
import { Category } from './Category';

@Table
export class RestPlaceCategory extends Model<RestPlaceCategory> {
    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @ForeignKey(() => RestPlace)
    @Column
    restPlaceId: number;
}
