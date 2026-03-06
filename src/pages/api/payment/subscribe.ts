import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

interface AuthedRequest extends NextApiRequest {
  user?: {
    email: string;
    [key: string]: any;
  };
}

const subscriptionsMap = new Map<string, number>();

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userEmail = session.user.email;

    // Rate limiting based on user email
    const requestCount = subscriptionsMap.get(userEmail) || 0;
    if (requestCount >= 5) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    subscriptionsMap.set(userEmail, requestCount + 1);

    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create a Checkout Session
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ sessionId: checkoutSession.id });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}