import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
    example: 0,
  })
  @IsNumber()
  quantities: number;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsNumber()
  hot: number;
}

export class productFilterDTO {
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
}