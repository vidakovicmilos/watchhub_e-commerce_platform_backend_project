import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test', required: false })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test1234', required: true })
  newPassword: string;
}
