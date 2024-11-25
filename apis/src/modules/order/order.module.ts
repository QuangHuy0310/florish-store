import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { Order, orderSchema } from '@entities/order.entities';
import { ProductModule } from '@modules/product/product.module';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
      },
    ]),
  ],
  controllers: [
    OrderController,],
  providers: [
    OrderService,],
})
export class OrderModule { }
