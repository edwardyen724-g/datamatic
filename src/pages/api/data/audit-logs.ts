import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auditLogsCollection = admin.firestore().collection('auditLogs');

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const logsSnapshot = await auditLogsCollection.orderBy('timestamp', 'desc').get();
    const logs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}