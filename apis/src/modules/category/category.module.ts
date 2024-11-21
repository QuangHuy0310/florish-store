import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { category, categorySchema } from '@entities/category.entities';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: category.name,
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
