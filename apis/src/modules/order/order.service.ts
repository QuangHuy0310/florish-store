import { Order, orderDocument } from '@entities/order.entities';
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

        @InjectModel(Order.name)
        private orderModel: Model<orderDocument>,
    ) { }

    async getAll(user: any) {
        const getID = user.sub;
        const getRole = user.role;

        // Xây dựng query cơ bản dựa trên quyền
        const matchCondition = {
            deletedAt: null,
            ...(getRole === 'user' ? { userID: getID } : {}),
        };

        const orders = await this.orderModel.aggregate([
            { $match: matchCondition },
            {
                $unwind: '$productID',
            },
            {
                $group: {
                    _id: { orderId: '$_id', productID: '$productID' },
                    quantity: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id.productID',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $group: {
                    _id: '$_id.orderId',
                    products: {
                        $push: {
                            product: '$productDetails',
                            quantity: '$quantity',
                        },
                    },
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'orderDetails',
                },
            },
            {
                $unwind: '$orderDetails',
            },
            {
                $project: {
                    _id: 1,
                    userID: '$orderDetails.userID',
                    total: '$orderDetails.total',
                    status: '$orderDetails.status',
                    createdAt: '$orderDetails.createdAt',
                    updatedAt: '$orderDetails.updatedAt',
                    address: '$orderDetails.address',
                    productDetails: '$products',
                    totalQuantity: 1,
                },
            },
        ]);

        if (!orders.length && getRole !== 'admin') {
            throw new HttpException(USER_ERRORS.WRONG_ROLE, HttpStatus.NOT_FOUND);
        }

        return orders;
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
            this.orderModel.findOne({ userID: ID, status: null, deletedAt: null }),
            this.getProduct(productID)
        ])
        const price: number = product.price
        if (isCheck) {
            return await this.addtoList(isCheck.id, productID, price)
        }
        const newOrder = {
            userID: ID,
            productID: [productID],
            status: null,
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

    async updateStatus(id: string): Promise<any> {
        await this.orderModel.findByIdAndUpdate(id, { "status": "pending" })
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

    async removeProductFromCart(user: any, productID: string): Promise<any> {
        const ID = user.sub;
    
        const [order, product] = await Promise.all([
            this.orderModel.findOne({ userID: ID }),
            this.getProduct(productID)
        ]);
    
        if (!order) {
            throw new HttpException('Giỏ hàng không tồn tại', HttpStatus.NOT_FOUND);
        }
    
        if (!product) {
            throw new HttpException('Sản phẩm không tồn tại', HttpStatus.NOT_FOUND);
        }
    
        if (!Array.isArray(order.productID)) {
            throw new HttpException('Dữ liệu giỏ hàng không hợp lệ', HttpStatus.BAD_REQUEST);
        }
    
        const initialProductCount = order.productID.length;
    
        const filteredProductIDs = order.productID.filter(item => item !== productID);
    
        const removedCount = initialProductCount - filteredProductIDs.length;
        
        const price = await this.getTotal(removedCount,product)
        order.total -= price
        order.productID = filteredProductIDs;
        await order.save();
    
        return { 
            message: `${removedCount} sản phẩm đã được xóa khỏi giỏ hàng` 
        };
    }
    

    async getTotal(numbers:number,productID:string): Promise<number> {
        const price = await this.productService.getOne(productID)

        const total = price.price * numbers
        return total
    }

}
