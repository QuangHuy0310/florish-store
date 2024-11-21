import { CategoryService } from '@modules/index-service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { cateDTO } from './dto/category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, RequiredByUserRoles } from '@utils/decorator';
import { USER_ROLE } from '@utils/data-types/enums';

@ApiTags('Category')
@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @Public()
    @Get()
    async get() {
        return await this.categoryService.getCategory()
    }
    @Public()
    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.categoryService.getOne(id)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Post()
    async postNewFeed(@Body() payload: cateDTO) {
        return await this.categoryService.create(payload)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Put('/:id')
    async updateNewFeed(@Param('id') id: string, @Body() payload: cateDTO) {
        return await this.categoryService.update(id, payload)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Delete('/:id')
    async deleteNewFeed(@Param('id') id: string) {
        return await this.categoryService.softDelete(id)
    }
}
