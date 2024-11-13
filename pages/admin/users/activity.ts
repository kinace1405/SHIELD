import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const admin = await verifyToken(req);
    if (!admin?.permissions?.includes('users.view')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { 
      userId, 
      action, 
      startDate, 
      endDate, 
      limit = 50, 
      offset = 0 
    } = req.query;

    const logs = await db.getActivityLogs({
      userId: userId as string,
      action: action as string,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    return res.status(200).json(logs);
  } catch (error) {
    log('error', 'Activity logs fetch error:', { error });
    return res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
}