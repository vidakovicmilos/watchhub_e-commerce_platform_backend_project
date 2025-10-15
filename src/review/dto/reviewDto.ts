import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReviewDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: 4 })
  rating: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'This is my review' })
  text?: string;
}
