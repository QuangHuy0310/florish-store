import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class cateDTO {
  @ApiPropertyOptional({
    example: 'The loai hoa',
  })
  @IsString()
  name: string;
}