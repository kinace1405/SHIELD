import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from '../../../utils/db';
import { log } from '../../../utils/logger';
import { corsMiddleware, runMiddleware } from '../../../middleware/apiMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, email } = req.body;

    const existingUser = await getUser(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, {
      username,
      email,
      password: hashedPassword,
      subscriptionTier: 'miles', // Default tier
      createdAt: new Date().toISOString()
    });

    log('info', 'User registered successfully', { username });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    log('error', 'Registration error:', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}