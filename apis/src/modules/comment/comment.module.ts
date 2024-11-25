import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

import { forwardRef, Module } from '@nestjs/common';
import { Comment, commentSchema } from '@entities/comment.entities';
import { ProductModule } from '@modules/product/product.module';

@Module({
    imports: [
        forwardRef(() => ProductModule),
        MongooseModule.forFeature([
            {
              name: Comment.name,
              schema: commentSchema,
            },
          ]),
    ],
    controllers: [
        CommentController, ],
    providers: [
        CommentService, ],
})
export class CommentModule {}
