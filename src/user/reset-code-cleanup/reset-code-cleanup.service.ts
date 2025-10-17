import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResetCodeCleanupService {
  private readonly logger = new Logger(ResetCodeCleanupService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async removeExpiredCodes() {
    const deleted = await this.prisma.resetCode.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    this.logger.log(`Deleted ${deleted.count} expired reset codes`);
  }
}
