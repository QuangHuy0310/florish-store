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
export class Category extends BaseEntity{
  @Prop({
    type: String,
  })
  name: string;
}

export const categorySchema = SchemaFactory.createForClass(Category);
export type categoryDocument = Category & Document;


