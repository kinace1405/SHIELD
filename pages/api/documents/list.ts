import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { log } from '../../../utils/logger';
import db from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
    };

    const documents = await db.list(`document:${decoded.username}`);
    const documentsList = await Promise.all(
      documents.map(async (key) => {
        const doc = await db.get(key);
        return {
          id: key.split(':').pop(),
          ...doc
        };
      })
    );

    res.status(200).json(documentsList);
  } catch (error) {
    log('error', 'Document list error:', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
}