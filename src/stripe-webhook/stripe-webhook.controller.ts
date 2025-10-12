import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post()
  @HttpCode(200)
  handleWebhook(@Req() req: Request) {
    return this.stripeWebhookService.handleWebhook(req);
  }
}
