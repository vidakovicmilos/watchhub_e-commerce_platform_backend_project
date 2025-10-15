import { Status } from '@prisma/client';
import { ProductFilterDto } from './productFilters.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const statusValues = Object.values(Status).join(', ');

export class MyProductsFiltersDto extends ProductFilterDto {
  @IsOptional()
  @IsEnum(Status, {
    message: `Status must be one of the following values: ${statusValues}`,
  })
  @ApiPropertyOptional({
    description: 'Filter by product status',
    enum: Status,
  })
  status?: Status;
}
