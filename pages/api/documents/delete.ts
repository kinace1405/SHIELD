import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { log } from '../../../utils/logger';
import db from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    const { documentId } = req.query;
    if (!documentId) {
      return res.status(400).json({ error: 'Document ID required' });
    }

    await db.delete(`document:${decoded.username}:${documentId}`);

    // Notify webhook about deletion
    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_document',
        username: decoded.username,
        documentId
      })
    });

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    log('error', 'Document deletion error:', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
}