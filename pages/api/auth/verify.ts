import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../utils/db';
import { log } from '../../../utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
    };

    const user = await getUser(decoded.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...userData } = user;

    res.status(200).json(userData);
  } catch (error) {
    log('error', 'Token verification error:', { error });
    res.status(401).json({ error: 'Invalid token' });
  }
}