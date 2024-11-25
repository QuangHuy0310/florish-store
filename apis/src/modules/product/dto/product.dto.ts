import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class productDTO {
  @ApiPropertyOptional({
    example: 'Ten Hoa',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'The loai hoa',
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    example: 'Mô tả',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 'img',
  })
  @IsString()
  img: string;

  @ApiPropertyOptional({
    type: Number, 
    example: 0,
  })
  @Optional()
  quantities: number;

  @ApiPropertyOptional({
    type: Number,
    example: 0,
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    example: 0,
    type: Number 
  })
  @Optional()
  hot: number;
}

export class productFilterDTO {
  @ApiPropertyOptional({
      example: 'Ten Hoa',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
      example: ['The loai hoa', 'The loai khac'], // Định nghĩa mảng ví dụ
      type: [String], // Xác định kiểu dữ liệu là mảng chuỗi
  })
  @IsOptional() // Không bắt buộc
  @IsArray() // Xác định là mảng
  @ArrayNotEmpty() // Đảm bảo mảng không rỗng (nếu cần)
  @IsString({ each: true }) // Mỗi phần tử trong mảng phải là chuỗi
  category: string[];
}
