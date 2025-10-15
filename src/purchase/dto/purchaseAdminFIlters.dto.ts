import { IsInt, IsOptional } from 'class-validator';
import { PurchaseBasicFiltersDto } from './purchaseBasicFilters.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseAdminFiltersDto extends PurchaseBasicFiltersDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Filter by seller ID' })
  sellerId?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  customerId?: number;
}
