import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import { log } from '@/utils/logger';
import db from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await verifyToken(req);
    if (!user?.permissions?.includes('users.manage')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        const userData = await db.getUser(id as string);
        if (!userData) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(userData);

      case 'PUT':
        const updatedUser = await db.updateUser(id as string, req.body);
        return res.status(200).json(updatedUser);

      case 'DELETE':
        await db.deleteUser(id as string);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    log('error', 'User API Error:', { error });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}