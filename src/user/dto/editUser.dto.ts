import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'test@gmial.com', required: false })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Marko', required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Markovic', required: false })
  lastName?: string;
}
