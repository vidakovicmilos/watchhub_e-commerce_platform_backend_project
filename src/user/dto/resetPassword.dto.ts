import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', required: true })
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@gmail.com', required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test123', required: true })
  newPassword: string;
}
