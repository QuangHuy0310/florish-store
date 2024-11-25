import { Product, productDocument } from '@entities/product.entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { productDTO, productFilterDTO } from './dto/product.dto';
import { USER_ERRORS } from '@utils/data-types/constants';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<productDocument>,
    ) { }

    async getAll(
        page = 1,
        limit = 10,
        payload: productFilterDTO,
        hot: boolean = false,
    ): Promise<{ items: productDTO[]; totalPages: number }> {
        if (page <= 0 || limit <= 0) {
            throw new HttpException(USER_ERRORS.WRONG_PAGE, HttpStatus.BAD_REQUEST);
        }
    
        const skip = (page - 1) * limit;
    
        const query: any = { deletedAt: null };
        const sortOrder: any = { createdAt: -1 };
    
        if (payload?.name?.trim()) {
            query.name = { $regex: payload.name.trim(), $options: 'i' };
        }
    
        // Lọc nhiều category nếu có
        if (payload?.category?.length > 0) {
            query.category = { $in: payload.category };
        }
    
        if (hot) {
            sortOrder.hot = -1;
        }
    
        const [items, totalItems] = await Promise.all([
            this.productModel
                .find(query)
                .sort(sortOrder)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments(query),
        ]);
    
        const totalPages = Math.ceil(totalItems / limit);
    
        return { items, totalPages };
    }
    

    async getOne(id: string): Promise<any> {
        return this.productModel.findById(id).where({ deletedAt: null })
    }

    async create(payload: any): Promise<any> {
        payload.hot = 0
        return new this.productModel(payload).save();
    }

    async update(id: string, payload: any): Promise<any> {
        await this.productModel.findByIdAndUpdate(id, payload)
        return "Success"
    }

    async softDelete(id: string): Promise<any> {
        return await this.productModel.findOneAndUpdate(
            { _id: id, deletedAt: { $eq: null } },
            { deletedAt: new Date() },
        )
    }

    async hotProduct(
        page = 1,
        limit = 10,
    ): Promise<{ items: productDTO[]; totalPages: number }> {
        if (page <= 0 || limit <= 0) {
            throw new HttpException(USER_ERRORS.WRONG_PAGE, HttpStatus.BAD_REQUEST);
        }

        const skip = (page - 1) * limit;

        const query: any = { deletedAt: null };

        const [items, totalItems] = await Promise.all([
            this.productModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return { items, totalPages };
    }

    // async report()


}
