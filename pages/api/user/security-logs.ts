import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import { log } from '@/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const logs = await db.getSecurityLogs(user.id, {
      limit: 10,
      orderBy: 'timestamp',
      order: 'desc'
    });

    return res.status(200).json(logs);
  } catch (error) {
    log('error', 'Security Logs Error:', { error });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}