import { CommentService } from '@modules/index-service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { USER_ROLE } from '@utils/data-types/enums';
import { Public, RequiredByUserRoles } from '@utils/decorator';
import { CommentDTO, MessageDTO } from './dto/comment.dto';
import { AuthorizationRequest } from '@utils/data-types/types';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) { }
    // @Public()
    // @Get()
    // async get() {
    //     return await this.commentService.getAll()
    // }
    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('/:id')
    async getOne(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Param('id') id: string,
    ) {
        return await this.commentService.getAll(page, limit, id)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN, USER_ROLE.USER)
    @Post('/:id')
    async postNewFeed(@Param('id') productID: string, @Request() { user }: AuthorizationRequest, @Body() payload: MessageDTO) {
        return await this.commentService.create(productID, user, payload)
    }

    // @RequiredByUserRoles(USER_ROLE.ADMIN)
    // @Put('/:id')
    // async updateNewFeed(@Param('id') id: string, @Body() payload: CommentDTO) {
    //     return await this.commentService.update(id, payload)
    // }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Delete('/:id')
    async deleteNewFeed(@Param('id') id: string) {
        return await this.commentService.softDelete(id)
    }
}
