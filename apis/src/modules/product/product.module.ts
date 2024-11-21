import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { product, productSchema } from '@entities/product.entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: product.name,
        schema: productSchema,
      },
    ]),
  ],
  controllers: [
    ProductController,],
  providers: [
    ProductService,],
  exports: [ProductService],
})
export class ProductModule { }
