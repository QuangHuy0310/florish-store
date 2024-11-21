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
export class order extends BaseEntity{
  @Prop({
    type: [String],
  })
  productID: string[];

  @Prop({
    type: String,
  })
  userID: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: Number,
  })
  total: number;

  @Prop({
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'cancelled']
  })
  status: string;
}

export const orderSchema = SchemaFactory.createForClass(order);
export type orderDocument = order & Document;


