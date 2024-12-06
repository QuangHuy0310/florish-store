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
export class Order extends BaseEntity{
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
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  recipientName: string;

  @Prop({
    type: String,
  })
  sender: string;

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

export const orderSchema = SchemaFactory.createForClass(Order);
export type orderDocument = Order & Document;


