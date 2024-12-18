import { OrderService } from '@modules/index-service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { USER_ROLE } from '@utils/data-types/enums';
import { RequiredByUserRoles } from '@utils/decorator';
import { InforDTO, orderDTO } from './dto/order.dto';
import { AuthorizationRequest } from '@utils/data-types/types';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @Get()
    async get(@Request() { user }: AuthorizationRequest) {
        console.log(user)
        return await this.orderService.getAll(user)
    }

    @RequiredByUserRoles(USER_ROLE.USER)
    @Get('history')
    async getHistory(@Request() { user }: AuthorizationRequest) {
        console.log(user)
        return await this.orderService.getHistory(user)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.orderService.getOne(id)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @ApiQuery({ name: 'productID', required: false, type: String })
    @Post()
    async postNewFeed(@Request() { user }: AuthorizationRequest, @Query('productID') productID: string) {
        return await this.orderService.addToCart(user, productID)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN,USER_ROLE.USER)
    @ApiQuery({ name: 'productID', required: false, type: String })
    @Delete('/dele-from-cart')
    async removeProductFromCart(@Request() { user }: AuthorizationRequest, @Query('productID') productID: string) {
        return await this.orderService.removeFromCart(user, productID)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN,USER_ROLE.USER)
    @ApiQuery({ name: 'productID', required: false, type: String })
    @Delete('/dele-from-cart-ALL')
    async removeAll(@Request() { user }: AuthorizationRequest, @Query('productID') productID: string) {
        return await this.orderService.removeProductFromCart(user, productID)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Put('/:id')
    async updateNewFeed(@Param('id') id: string, @Body() payload: orderDTO) {
        return await this.orderService.update(id, payload)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Delete('/:id')
    async deleteNewFeed(@Param('id') id: string) {
        return await this.orderService.softDelete(id)
    }
    @ApiQuery({ name: 'status', required: true, type: String })
    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @Post('confirm-payment/:orderId')
    async updateOrder(@Param('orderId') orderId: string, @Query('status') status:string) {
        const order = await this.orderService.confirmPayment(orderId, status)
        return {
            success: true,
            message: "Order confirmed and products updated successfully",
            data: order
        }
    }

    @RequiredByUserRoles(USER_ROLE.USER)
    @Put('infor/:id')
    async updateAddress(@Param('id') id: string, @Body() payload: InforDTO, @Request() { user }: AuthorizationRequest) {
        return await this.orderService.updateInfor(id, payload, user)
    }

    @RequiredByUserRoles(USER_ROLE.USER)
    @Put('status/:id')
    async updateStatus(@Param('id') id: string) {
        return await this.orderService.updateStatus(id)
    }
}
