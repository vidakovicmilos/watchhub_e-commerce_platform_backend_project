import { IsOptional, IsInt } from 'class-validator';
import { PurchaseBasicFiltersDto } from './purchaseBasicFilters.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseSellerFiltersDto extends PurchaseBasicFiltersDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  customerId?: number;
}
