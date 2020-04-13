import {
    Column, ForeignKey, Model, Table
} from 'sequelize-typescript';

import { RestPlace } from './RestPlace';
import { Category } from './Category';

@Table
class RestPlaceCategory extends Model<RestPlaceCategory> {
    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @ForeignKey(() => RestPlace)
    @Column
    restPlaceId: number;
}
