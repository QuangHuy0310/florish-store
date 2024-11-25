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
export class Comment  extends BaseEntity{
  @Prop({
    type: String,
  })
  productID: string;

  @Prop({
    type: String,
  })
  userID: string;

  @Prop({
    type: String,
  })
  message: string;

}

export const commentSchema = SchemaFactory.createForClass(Comment );
export type commentDocument = Comment  & Document;


