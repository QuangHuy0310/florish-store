import { Comment, commentDocument } from '@entities/comment.entities';
import { ProductService } from '@modules/product/product.service';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_ERRORS } from '@utils/data-types/constants';
import { Model } from 'mongoose';

@Injectable()
export class CommentService {
    constructor(
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,

        @InjectModel(Comment.name)
        private commentModel: Model<commentDocument>,
    ) { }

    async getAll(page: number, limit: number, productID: string): Promise<any> {
        const skip = (page - 1) * limit; 
        const comments = await this.commentModel
            .find({ deletedAt: null, productID: productID }) 
            .skip(skip)
            .limit(limit)
            .exec(); 
    
        const total = await this.commentModel.countDocuments({ deletedAt: null, productID: productID });
        return {
            data: comments,
            totalPages: Math.ceil(total / limit), 
        };
    }
    

    async getOne(id: string): Promise<any> {
        return this.commentModel.findById(id).where({ deletedAt: null })
    }

    async validProduct(productID: string): Promise<string> {
        const isCheck = await this.productService.getOne(productID)
        if (!isCheck) {
            throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return isCheck._id
    }

    async create(productID: string, userID:any, payload: any): Promise<any> {
        const isCheck = await this.validProduct(productID)
        payload.productID = isCheck
        payload.userID = userID.sub
        return new this.commentModel(payload).save();
    }

    // async update(id: string, payload: any): Promise<any> {
    //     await this.commentModel.findByIdAndUpdate(id, payload)
    //     return "Success"
    // }

    async softDelete(id: string): Promise<any> {
        return await this.commentModel.findOneAndUpdate(
            { _id: id, deletedAt: { $eq: null } },
            { deletedAt: new Date() },
        )
    }

}
