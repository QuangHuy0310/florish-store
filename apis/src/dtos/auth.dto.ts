import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { USER_ROLE } from '@utils/data-types/enums';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Matches, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsFlexiblePhoneNumber', async: false })
export class IsFlexiblePhoneNumber implements ValidatorConstraintInterface {
  validate(phone: string) {
    const internationalRegex = /^\+?[1-9]\d{1,14}$/; // E.164
    const localRegex = /^0\d{9}$/; // Local VN numbers
    return internationalRegex.test(phone) || localRegex.test(phone);
  }

  defaultMessage() {
    return 'phone must be a valid phone number';
  }
}
export class RegisterDto {
  @ApiProperty({
    example: 'nt.binh@tego.global',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)
  password: string;

  @ApiProperty({
    example: USER_ROLE.ADMIN,
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  @IsEnum(USER_ROLE)

  role: USER_ROLE;

  @ApiPropertyOptional({
    example: '101 Gò Vấp',
  })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    example: 'Duong',
  })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: '+84975824232',
  })
  @IsOptional()
  @Validate(IsFlexiblePhoneNumber)
  phone: string;
}

export class LoginDto extends OmitType(RegisterDto, ['role']) { }
