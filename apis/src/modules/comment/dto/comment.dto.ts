import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDTO {
  @ApiPropertyOptional({
    example: 'ID12345',
  })
  @IsString()
  productID: string;

  @ApiPropertyOptional({
    example: 'ID12345',
  })
  @IsString()
  userID: string;

  @ApiPropertyOptional({
    example: 'Xin Chao',
  })
  @IsString()
  message: string;
}

export class MessageDTO {
    @ApiPropertyOptional({
      example: 'Xin Chao',
    })
    @IsString()
    message: string;
  }