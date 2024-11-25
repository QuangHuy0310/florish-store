import { BaseEntity } from '@entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_ROLE } from '@utils/data-types/enums';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  collectionOptions: {
    changeStreamPreAndPostImages: { enabled: true },
  },
})
export class Product extends BaseEntity{
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  category: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
  })
  img: string;

  @Prop({
    type: Number,
  })
  quantities: number;

  @Prop({
    type: Number,
  })
  price: number;

  @Prop({
    type: Number,
  })
  hot: number;


}

export const productSchema = SchemaFactory.createForClass(Product);
export type productDocument = Product & Document;


