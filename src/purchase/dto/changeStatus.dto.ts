import { PurchaseStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

const enumValues = Object.values(PurchaseStatus).join(', ');

export class ChangePurchaseStatus {
  @IsNotEmpty()
  @IsEnum(PurchaseStatus, {
    message: `Status must be one of the following values: ${enumValues}`,
  })
  status: PurchaseStatus;
}
