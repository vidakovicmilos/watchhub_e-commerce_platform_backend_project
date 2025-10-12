import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;
  private endpointSecret: string;
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // Initialize Stripe client
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: this.config.get('STRIPE_API_VERSION'),
    });
    this.endpointSecret = this.config.get('STRIPE_WEBHOOK_SECRET')!;
  }

  async handleWebhook(req: Request) {
    // Retrieve Stripe signature from headers
    const sig = req.headers['stripe-signature'];
    if (!sig || Array.isArray(sig)) {
      this.logger.error('Missing or invalid Stripe signature');
      return { received: false, error: 'Missing Stripe signature' };
    }

    // Get raw body from the request (required by Stripe)
    const buf = req.body as Buffer;

    let event: Stripe.Event;

    try {
      // Verify webhook signature and parse event
      event = this.stripe.webhooks.constructEvent(
        buf,
        sig,
        this.endpointSecret,
      );
    } catch (err: any) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      return { received: false, error: `Webhook Error: ${err.message}` };
    }

    this.logger.log(`Webhook received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Extract metadata
      const productId = parseInt(session.metadata?.productId || '0');
      const customerId = parseInt(session.metadata?.customerId || '0');
      const sellerId = parseInt(session.metadata?.sellerId || '0');

      // Extract shipping address from Stripe session
      const shippingAddress =
        session.customer_details?.address ||
        session.collected_information?.shipping_details?.address;

      if (!shippingAddress) {
        this.logger.error(`Shipping address missing for session ${session.id}`);
        return { received: false, error: 'Shipping address is required' };
      }

      // Convert shipping address to JSON-compatible object
      const shippingAddressJson = JSON.parse(JSON.stringify(shippingAddress));

      try {
        // Create purchase record in the database
        const purchase = await this.prisma.purchase.create({
          data: {
            productId,
            customerId,
            sellerId,
            stripeSessionId: session.id,
            email: session.customer_email!,
            shippingAddress: shippingAddressJson,
            status: 'PAID',
          },
        });

        // Mark product as sold
        await this.prisma.product.update({
          where: { id: productId },
          data: { status: 'SOLD' },
        });

        this.logger.log(`Purchase created successfully: ${purchase.id}`);
        return { received: true };
      } catch (error: any) {
        this.logger.error(`Failed to create purchase: ${error.message}`);
        return { received: false, error: error.message };
      }
    }

    return { received: true };
  }
}
