import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { ResetCodeCleanupService } from './reset-code-cleanup/reset-code-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule],
  controllers: [UserController],
  providers: [UserService, ResetCodeCleanupService],
})
export class UserModule {}
