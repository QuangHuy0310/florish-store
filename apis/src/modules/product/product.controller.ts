import { ProductService } from '@modules/index-service'
import { Request } from 'express';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { USER_ROLE } from '../../utils/data-types/enums';
import { Public, RequiredByUserRoles } from '../../utils/decorator';
import { productDTO, productFilterDTO } from './dto/product.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Product')
@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Public()
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'hot', required: false, type: String })
    async get(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('hot') hot: boolean,
        @Query() payload: Omit<productFilterDTO, 'page' | 'limit' | 'hot'>,
    ) {
        console.log('123S')
        return await this.productService.getAll(page, limit, payload, hot);

    }

    @Public()
    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.productService.getOne(id)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Post()
    async postNewFeed(@Body() payload: productDTO) {
        return await this.productService.create(payload)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Put('/:id')
    async updateNewFeed(@Param('id') id: string, @Body() payload: productDTO) {
        return await this.productService.update(id, payload)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Delete('/:id')
    async deleteNewFeed(@Param('id') id: string) {
        return await this.productService.softDelete(id)
    }

    @RequiredByUserRoles(USER_ROLE.ADMIN)
    @Post('/upload-image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './upload/images',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + file.originalname;
                    callback(null, uniqueSuffix);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new BadRequestException('Only image files are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    async addNewImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        if (!file) {
            throw new BadRequestException('No file uploaded or file is invalid.');
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/upload/images/${file.filename}`;
        return fileUrl;
    }
}


