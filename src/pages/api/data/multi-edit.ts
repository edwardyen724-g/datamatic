import type { NextApiRequest, NextApiResponse } from 'next';
import { firestoreAdmin } from '../../../lib/firebaseAdmin'; // Assuming you have a firebaseAdmin setup
import { getSession } from 'next-auth/react';

interface AuthedRequest extends NextApiRequest {
  user?: {
    email: string;
    id: string;
  };
}

const rateLimit = new Map<string, number>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_REQUESTS = 5; // allows 5 requests per window

const multiEditHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = {
      email: session.user.email,
      id: session.user.id,
    };

    const currentTime = Date.now();
    const userKey = req.user.id;

    if (!rateLimit.has(userKey)) {
      rateLimit.set(userKey, 1);
    } else {
      const requestCount = rateLimit.get(userKey)!;
      if (requestCount >= RATE_LIMIT_REQUESTS) {
        return res.status(429).json({ message: 'Rate limit exceeded. Try again later.' });
      }
      rateLimit.set(userKey, requestCount + 1);
    }

    setTimeout(() => {
      if (rateLimit.has(userKey)) {
        const requestCount = rateLimit.get(userKey)!;
        if (requestCount > 1) {
          rateLimit.set(userKey, requestCount - 1);
        } else {
          rateLimit.delete(userKey);
        }
      }
    }, RATE_LIMIT_WINDOW);

    if (req.method === 'POST') {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Invalid updates provided.' });
      }

      const promises = updates.map(async (update: any) => {
        const { id, data } = update;
        await firestoreAdmin.collection('data').doc(id).update(data);
      });

      await Promise.all(promises);

      return res.status(200).json({ message: 'Data updated successfully.' });
    } else {
      return res.status(405).json({ message: 'Method not allowed.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default multiEditHandler;