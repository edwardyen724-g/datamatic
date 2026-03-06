import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import mongoose from 'mongoose';

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

initializeApp({
  credential: process.env.FIREBASE_ADMIN_CREDENTIAL
    ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL)
    : undefined,
});

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const { email, password } = req.body;

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
    });
    
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export default handler;