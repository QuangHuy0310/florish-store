import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from '@entities/category.entities';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: Category.name,
              schema: categorySchema,
            },
          ]),
    ],
    controllers: [
        CategoryController, ],
    providers: [
        CategoryService, ],
})
export class CategoryModule {}
