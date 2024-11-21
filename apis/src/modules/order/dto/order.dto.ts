import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class orderDTO {
  @ApiProperty({
    example: ['prod123', 'prod456'],
    description: 'Danh sách ID sản phẩm được đặt hàng',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productID: string[];

  @ApiProperty({
    example: 'user789',
    description: 'ID của người dùng đặt hàng',
  })
  @IsString()
  @IsNotEmpty()
  userID: string;

  @ApiPropertyOptional({
    example: 'pending',
    description: 'Trạng thái của đơn hàng',
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: '123 Main Street, Hometown',
    description: 'Địa chỉ giao hàng',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 169,
    description: 'Tổng tiền của đơn hàng',
  })
  @IsNumber()
  total: number;
}

export class orderStatusDTO {
    @ApiPropertyOptional({
      example: 'status',
    })
    @IsString()
    status: string;
}

export class AddProductToCartDTO {
  @ApiProperty({
    example: 'prod123',
    description: 'ID của sản phẩm cần thêm vào giỏ hàng',
  })
  @IsString()
  @IsNotEmpty()
  productID: string;

  @ApiProperty({
    example: 100,
    description: 'Giá của sản phẩm',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}


export class AddressDTO {
  @ApiProperty({
    example: '1/1/ PVD',
  })
  @IsString()
  address: string;

}