import { order, orderDocument } from '@entities/order.entities';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddProductToCartDTO, orderDTO } from './dto/order.dto';
import { ProductService } from '@modules/product/product.service';
import { USER_ERRORS } from '@utils/data-types/constants';

@Injectable()
export class OrderService {
    constructor(
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,

        @InjectModel(order.name)
        private orderModel: Model<orderDocument>,
    ) { }
    async getAll(id: any) {
        const getID = id.sub
        return this.orderModel.find({ deletedAt: null, userID: getID })
    }

    async getOne(id: string): Promise<any> {
        return this.orderModel.findById(id).where({ deletedAt: null })
    }

    async getProduct(id: string): Promise<any> {
        let priceOfProduct = await this.productService.getOne(id)

        if (!priceOfProduct) {
            throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return priceOfProduct
    }

    async addToCart(user: any, productID: any): Promise<any> {
        const ID = user.sub;

        const [isCheck, product] = await Promise.all([
            this.orderModel.findOne({ userID: ID, status: 'pending', deletedAt: null }),
            this.getProduct(productID)
        ])
        const price: number = product.price
        if (isCheck) {
            return await this.addtoList(isCheck.id, productID, price)
        }
        const newOrder = {
            userID: ID,
            productID: [productID],
            status: 'pending',
            total: price
        }
        await this.create(newOrder)
    }

    async addtoList(id: string, productID: any, price: number) {
        const isCheck = await this.orderModel.findById(id)
        console.log(isCheck)
        if (!isCheck) {
            throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        isCheck.productID.push(productID)
        isCheck.total += price;
        await isCheck.save()
    }

    async removeFromCart(user: any, productID: any): Promise<any> {
        const ID = user.sub;

        const [order, product] = await Promise.all([
            this.orderModel.findOne({ userID: ID }),
            this.getProduct(productID)
        ])

        if (!order) {
            throw new HttpException('Giỏ hàng không tồn tại', HttpStatus.NOT_FOUND);
        }

        const productIndex = order.productID.indexOf(productID);
        if (productIndex === -1) {
            throw new HttpException('Sản phẩm không có trong giỏ hàng', HttpStatus.NOT_FOUND);
        }

        order.productID.splice(productIndex, 1);
        order.total -= product.price
        await order.save();
        return { message: 'Sản phẩm đã được xóa khỏi giỏ hàng' };
    }

    async create(payload: any): Promise<any> {

        return new this.orderModel(payload).save();
    }

    async update(id: string, payload: any): Promise<any> {
        await this.orderModel.findByIdAndUpdate(id, payload)
        return "Success"
    }
    async updateAddress(id: string, payload: any, userID: any): Promise<any> {
        const getID = userID.sub
        const isCheck = await this.orderModel.findById(id)
        if (!isCheck || isCheck.userID !== getID) {
            throw new HttpException('Sai thông tin', HttpStatus.NOT_FOUND);
        }
        await this.orderModel.findByIdAndUpdate(id, payload)
        return "Success"
    }

    async softDelete(id: string): Promise<any> {
        return await this.orderModel.findOneAndUpdate(
            { _id: id, deletedAt: { $eq: null } },
            { deletedAt: new Date() },
        )
    }

    async confirmPayment(orderId: string): Promise<any> {
        const order = await this.orderModel.findById(orderId);

        if (!order) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        if (order.status !== 'pending') {
            throw new HttpException(
                `Order status must be 'pending' to confirm payment`,
                HttpStatus.BAD_REQUEST
            );
        }

        order.status = 'completed';
        await order.save();

        await Promise.all(
            order.productID.map(async (productId) => {
                const product = await this.productService.getOne(productId);
                if (product) {
                    product.hot = (product.hot || 0) + 1;
                    await product.save();
                }
            })
        );

        return order;
    }

}
