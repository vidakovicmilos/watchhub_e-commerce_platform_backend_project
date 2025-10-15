import { IsOptional, IsInt } from 'class-validator';
import { PurchaseBasicFiltersDto } from './purchaseBasicFilters.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseCustomerFiltersDto extends PurchaseBasicFiltersDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Filter by seller ID' })
  sellerId?: number;
}
