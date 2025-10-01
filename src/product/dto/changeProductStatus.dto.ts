import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

const enumValues = Object.values(Status).join(', ');

export class ChangeProductStatusDto {
  @IsEnum(Status, {
    message: `Status must be one of the following values: ${enumValues}`,
  })
  @IsNotEmpty()
  status: Status;
}
